// API_URL is defined in main.js
// const API_URL = ...;

let currentCart = [];

// Needs toys from data.js
async function renderCart() {
    try {
        const res = await fetch(`${API_URL}/cart`, { credentials: "include" });
        if (res.status === 401) {
            // Do not redirect automatically. Just show empty or login prompt.
            // window.location.href = "signin.html";
            const cartList = document.getElementById("cartList");
            if (cartList) cartList.innerHTML = "<p>Please <a href='signin.html'>Sign In</a> to view your cart.</p>";
            return;
        }

        const data = await res.json();
        const serverCart = data.cart || [];
        currentCart = serverCart; // Store for checkout usage

        const cartList = document.getElementById("cartList");
        const emptyMsg = document.getElementById("emptyCartMsg");
        const summary = document.getElementById("cartSummary");
        const totalAmount = document.getElementById("totalAmount");

        if (!cartList) return;

        cartList.innerHTML = "";

        if (serverCart.length === 0) {
            if (emptyMsg) emptyMsg.classList.remove("hidden");
            if (summary) summary.classList.add("hidden");
            return;
        }

        if (emptyMsg) emptyMsg.classList.add("hidden");
        if (summary) summary.classList.remove("hidden");

        let total = 0;

        serverCart.forEach(item => {
            // Find toy details from global toys array (data.js must be loaded)
            // item has toyId and quantity
            const toyId = Number(item.toyId);
            // In data.js, toy.id is Number
            // toys is global.

            if (typeof toys === 'undefined') {
                console.error("Toys data not loaded");
                return;
            }

            const toy = toys.find(t => t.id === toyId);
            if (!toy) return;

            const subtotal = toy.price * item.quantity;
            total += subtotal;

            cartList.innerHTML += `
                <div class="cart-card">
                    <img src="${toy.image}" class="cart-img">
                    <div class="cart-info">
                        <h3>${toy.name}</h3>
                        <p>Price: ₹${toy.price}</p>
                        <p>Quantity: ${item.quantity}</p>
                        <p>Subtotal: ₹${subtotal}</p>
                        <div class="cart-actions">
                            <button onclick="updateCart(${toy.id}, -1)">-</button>
                            <button onclick="updateCart(${toy.id}, 1)">+</button>
                        </div>
                    </div>
                </div>
            `;
        });

        if (totalAmount) totalAmount.textContent = total;

    } catch (err) {
        console.error("Error rendering cart", err);
    }
}

async function updateCart(id, change) {
    // change is +1 or -1
    try {
        const res = await fetch(`${API_URL}/cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ toyId: id, quantity: change, action: 'add' })
        });

        if (res.status === 401) {
            window.location.href = "signin.html";
            return;
        }

        renderCart();

    } catch (err) {
        console.error("Error updating cart", err);
    }
}

// Modal Functions
window.closeOrderModal = function () {
    const modal = document.getElementById("orderModal");
    if (modal) modal.classList.add("hidden");
}

async function requestCheckout() {
    if (!currentCart || currentCart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Calculate totals
    let totalItems = 0;
    let totalAmount = 0;

    currentCart.forEach(item => {
        const toy = toys.find(t => t.id === Number(item.toyId));
        if (toy) {
            totalItems += item.quantity;
            totalAmount += toy.price * item.quantity;
        }
    });

    // Update Modal
    const modalTotalItems = document.getElementById("modalTotalItems");
    const modalTotalAmount = document.getElementById("modalTotalAmount");

    if (modalTotalItems) modalTotalItems.textContent = totalItems;
    if (modalTotalAmount) modalTotalAmount.textContent = totalAmount;

    const currentSection = document.getElementById("modalOrderCurrent");
    const successSection = document.getElementById("modalOrderSuccess");

    if (currentSection) currentSection.classList.remove("hidden");
    if (successSection) successSection.classList.add("hidden");

    const modal = document.getElementById("orderModal");
    if (modal) modal.classList.remove("hidden");

    // Setup confirm button
    const confirmBtn = document.getElementById("confirmOrderBtn");
    if (confirmBtn) confirmBtn.onclick = processCheckout;
}

async function processCheckout() {
    const confirmBtn = document.getElementById("confirmOrderBtn");
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = "Processing...";
    }

    try {
        const res = await fetch(`${API_URL}/checkout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });

        const data = await res.json();

        if (data.success) {
            // Show Success in Modal
            const currentSection = document.getElementById("modalOrderCurrent");
            const successSection = document.getElementById("modalOrderSuccess");
            const orderIdSpan = document.getElementById("modalOrderId");

            if (currentSection) currentSection.classList.add("hidden");
            if (successSection) successSection.classList.remove("hidden");
            if (orderIdSpan) orderIdSpan.textContent = data.orderId;

            renderCart(); // Clear background cart
        } else {
            alert(data.error || "Checkout failed");
            closeOrderModal();
        }
    } catch (err) {
        console.error("Checkout error", err);
        alert("Server error during checkout");
        closeOrderModal();
    } finally {
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.textContent = "Proceed";
        }
    }
}

// Initial render & listeners
document.addEventListener("DOMContentLoaded", () => {
    renderCart();

    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", requestCheckout);
    }
});