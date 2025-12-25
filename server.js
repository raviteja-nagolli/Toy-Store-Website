const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
    credentials: true
}));
app.use(bodyParser.json());

app.use(session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
}));

mongoose.connect("mongodb://127.0.0.1:27017/toystore1").then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: Number,
    mobile: String,
    password: { type: String, required: true },
    cart: [{ toyId: Number, quantity: Number }]
});

const User = mongoose.model("User", userSchema);

function auth(req, res, next) {
    if (!req.session.user) return res.status(401).json({ success: false, error: "Not logged in" });
    next();
}

app.post("/signup", async (req, res) => {
    const { role, name, email, age, mobile, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, error: "Email already exists" });

        const hashed = await bcrypt.hash(password, 10);
        user = new User({ role, name, email, age, mobile, password: hashed });
        await user.save();

        req.session.user = { id: user._id, role: user.role, name: user.name };
        res.json({ success: true, user: req.session.user });
    } catch (err) {
        res.status(500).json({ success: false, error: "Server error" });
    }
});

app.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, error: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ success: false, error: "Invalid credentials" });

        req.session.user = { id: user._id, role: user.role, name: user.name };
        res.json({ success: true, user: req.session.user });
    } catch (err) {
        res.status(500).json({ success: false, error: "Server error" });
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

app.get("/me", (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

app.get("/cart", auth, async (req, res) => {
    const user = await User.findById(req.session.user.id);
    res.json({ success: true, cart: user.cart });
});

app.post("/cart", auth, async (req, res) => {
    const { toyId, quantity, action } = req.body;
    const user = await User.findById(req.session.user.id);

    const tId = Number(toyId);
    const qty = Number(quantity);

    const index = user.cart.findIndex(c => c.toyId === tId);
    if (index > -1) {
        if (action === 'add') {
            user.cart[index].quantity += qty;
        } else {
            user.cart[index].quantity = qty;
        }

        if (user.cart[index].quantity <= 0) {
            user.cart.splice(index, 1);
        }
    } else {
        if (qty > 0) {
            user.cart.push({ toyId: tId, quantity: qty });
        }
    }

    await user.save();
    res.json({ success: true, cart: user.cart });
});

const toySchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: String,
    image: String,
    price: Number,
    category: String,
    age: String,
    rating: Number,
    stock: Number
});
const Toy = mongoose.model("Toy", toySchema);

const orderSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    userName: String,
    items: [],
    totalAmount: Number,
    status: { type: String, default: "Pending" },
    date: { type: Date, default: Date.now }
});
const Order = mongoose.model("Order", orderSchema);

function adminAuth(req, res, next) {
    if (!req.session.user || req.session.user.role !== "admin") {
        return res.status(403).json({ success: false, error: "Access denied" });
    }
    next();
}

app.get("/toys", async (req, res) => {
    const toys = await Toy.find({});
    res.json(toys);
});

app.post("/toys", adminAuth, async (req, res) => {
    const lastToy = await Toy.findOne().sort({ id: -1 });
    const newId = lastToy ? lastToy.id + 1 : 1;

    const toy = new Toy({ ...req.body, id: newId });
    await toy.save();
    res.json({ success: true, toy });
});

app.delete("/toys/:id", adminAuth, async (req, res) => {
    await Toy.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
});

app.put("/toys/:id", adminAuth, async (req, res) => {
    await Toy.findOneAndUpdate({ id: req.params.id }, req.body);
    res.json({ success: true });
});

app.post("/seed-toys", adminAuth, async (req, res) => {
    const count = await Toy.countDocuments();
    if (count > 0) return res.json({ success: false, message: "Database already has toys" });

    await Toy.insertMany(req.body.toys);
    res.json({ success: true });
});

app.post("/checkout", auth, async (req, res) => {
    const user = await User.findById(req.session.user.id);
    if (!user.cart || user.cart.length === 0) return res.status(400).json({ error: "Cart is empty" });

    const toyIds = user.cart.map(i => i.toyId);
    const dbToys = await Toy.find({ id: { $in: toyIds } });

    let total = 0;
    const orderItems = user.cart.map(cartItem => {
        const toy = dbToys.find(t => t.id === cartItem.toyId);
        if (!toy) return null;

        const sub = toy.price * cartItem.quantity;
        total += sub;

        return {
            toyId: toy.id,
            name: toy.name,
            price: toy.price,
            quantity: cartItem.quantity,
            image: toy.image
        };
    }).filter(i => i !== null);

    const order = new Order({
        userId: user._id,
        userName: user.name,
        items: orderItems,
        totalAmount: total
    });

    await order.save();

    user.cart = [];
    await user.save();

    res.json({ success: true, orderId: order._id });
});

app.get("/orders", adminAuth, async (req, res) => {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
});

app.put("/orders/:id", adminAuth, async (req, res) => {
    const { status } = req.body;
    await Order.findByIdAndUpdate(req.params.id, { status });
    res.json({ success: true });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
