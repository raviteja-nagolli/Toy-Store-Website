const API_URL = `http://${window.location.hostname}:5000`;

// Check Session on Load
async function checkSession() {
    try {
        const res = await fetch(`${API_URL}/me`, {
            credentials: "include"
        });

        if (!res.ok) return;

        const data = await res.json();

        if (data.loggedIn && data.user) {
            const authButtons = document.getElementById("authButtons");
            const userSection = document.getElementById("userSection");

            if (authButtons) authButtons.classList.add("hidden");
            if (userSection) userSection.classList.remove("hidden");

            const userIcon = document.getElementById("userIcon");
            if (userIcon) userIcon.textContent = data.user.name.charAt(0).toUpperCase();

            // Admin Navigation
            if (data.user.role === 'admin') {
                const navLinks = document.querySelector(".nav-links");
                if (navLinks) {
                    // Update active state logic if needed, but for now just replace links
                    // We can keep 'Home' or maybe Admin Dashboard? Usually Home is fine.
                    navLinks.innerHTML = `
                        <a href="index.html" class="nav-item">Home</a>
                        <a href="admin-products.html" class="nav-item">Product Management</a>
                        <a href="admin-orders.html" class="nav-item">Order Management</a>
                    `;
                }
            }
        }
    } catch (err) {
        console.error("Session check failed", err);
    }
}

checkSession();

// Logout
window.logout = function () {
    fetch(`${API_URL}/logout`, {
        credentials: "include"
    }).then(() => {
        window.location.href = "signin.html";
    });
}

// Global Cart & Logic
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Filters
let filters = {
    categories: [],
    age: "",
    maxPrice: 5000,
    rating: 0,
    sort: "",
};

document.addEventListener("DOMContentLoaded", () => {
    // Only run toy rendering if on toys page
    const toyListContainer = document.getElementById("toyList");
    if (toyListContainer && typeof toys !== "undefined") {
        renderToys(toys);
        setupFilters();
    }

    // Signup Form Handling
    const signupForm = document.querySelector(".signup-form");
    if (signupForm) {
        setupSignup();
    }
});

function setupFilters() {
    // Categories
    document.querySelectorAll("#cat input[type='checkbox']").forEach(cb => {
        cb.addEventListener("change", () => {
            filters.categories = [...document.querySelectorAll("#cat input:checked")]
                .map(i => i.value);
            applyFilters();
        });
    });

    // Price
    const priceRange = document.querySelector("#price input[type='range']");
    const priceValue = document.getElementById("priceValue");
    if (priceRange) {
        priceRange.addEventListener("input", () => {
            filters.maxPrice = Number(priceRange.value);
            if (priceValue) priceValue.textContent = priceRange.value;
            applyFilters();
        });
    }

    // Age
    setupToggleRadios("#age input", value => {
        filters.age = value;
    });

    // Rating
    setupToggleRadios("#rating input", value => {
        filters.rating = value ? Number(value) : 0;
    });

    // Sort
    setupToggleRadios("#sort input", value => {
        filters.sort = value || "";
    });
}

function inAgeRange(toyAge, filterAge) {
    if (!filterAge) return true;

    if (filterAge === "10+") {
        return toyAge.includes("+") || Number(toyAge.split("-")[0]) >= 10;
    }

    const [fMin, fMax] = filterAge.split("-").map(Number);

    if (toyAge.includes("+")) {
        return Number(toyAge) >= fMin;
    }

    // specific range e.g "3-5"
    if (toyAge.includes("-")) {
        const [tMin, tMax] = toyAge.split("-").map(Number);
        return tMin <= fMax && tMax >= fMin;
    }

    return Number(toyAge) <= fMax && Number(toyAge) >= fMin;
}

function applyFilters() {
    if (typeof toys === 'undefined') return;

    let result = toys.filter(toy => {
        const categoryMatch =
            filters.categories.length === 0 ||
            filters.categories.includes(toy.category);

        const priceMatch = toy.price <= filters.maxPrice;

        const ratingMatch = filters.rating === 0 || toy.rating >= filters.rating;

        const ageMatch = inAgeRange(toy.age, filters.age);

        return categoryMatch && priceMatch && ratingMatch && ageMatch;
    });

    if (filters.sort === "low") {
        result.sort((a, b) => a.price - b.price);
    }

    if (filters.sort === "high") {
        result.sort((a, b) => b.price - a.price);
    }

    renderToys(result);
}

function setupToggleRadios(selector, onChange) {
    document.querySelectorAll(selector).forEach(radio => {
        radio.addEventListener("click", e => {
            if (radio.checked && radio.dataset.checked === "true") {
                radio.checked = false;
                radio.dataset.checked = "false";
                onChange("");
            } else {
                document.querySelectorAll(selector).forEach(r => {
                    r.dataset.checked = "false";
                });
                radio.dataset.checked = "true";
                onChange(radio.value);
            }
            applyFilters();
        });
    });
}

function renderToys(list) {
    const container = document.getElementById("toyList");
    if (!container) return;

    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = "<p>No toys found matching your criteria.</p>";
        return;
    }

    list.forEach(toy => {
        const disabled = toy.stock === 0 ? "disabled" : "";
        const label = toy.stock === 0 ? "Out of Stock" : "Add to Cart";
        const btnClass = toy.stock === 0 ? "btn-disabled" : "btn-primary";

        container.innerHTML += `
            <div class="toy-card">
                <img src="${toy.image}">
                <h3>${toy.name}</h3>
                <p>₹${toy.price}</p>
                <p>⭐ ${toy.rating}</p>
                <button class="${btnClass}" ${disabled} onclick='addToCart(${toy.id})'>
                    ${label}
                </button>
            </div>
        `;
    });
}

// Add to Cart Logic
// Tries to add to backend cart first. If not logged in, falls back to localStorage?
// Or we enforce login? The cart.js redirects to signin if 401.
// Let's try backend first, if 401, redirect to signin.
async function addToCart(id) {
    // Check if toys is available to get toy details (for localStorage fallback or UI update)
    // But since we want to be fullstack, let's use the API.

    try {
        const res = await fetch(`${API_URL}/cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            // Use action: 'add' to increment quantity
            body: JSON.stringify({ toyId: id, quantity: 1, action: 'add' })
        });

        if (res.status === 401) {
            // Not logged in
            alert("Please sign in to add items to your cart.");
            window.location.href = "signin.html";
            return;
        }

        const data = await res.json();
        if (data.success) {
            // alert("Item added to cart!"); // Removed as requested
        } else {
            alert("Failed to add to cart");
        }
    } catch (err) {
        console.error("Add to cart error", err);
        // Fallback or alert
        alert("Server error. Please try again later.");
    }
}

window.toggleSection = function (id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("active");
}

window.toggleDropdown = function () {
    const dd = document.getElementById("dropdown");
    if (dd) dd.classList.toggle("hidden");
}

// Signup Logic
function togglePassword(id) {
    const input = document.getElementById(id);
    if (input) input.type = input.type === "password" ? "text" : "password";
}

function setupSignup() {
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const signupBtn = document.getElementById("signupBtn");
    const errorText = document.getElementById("password-error");

    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    window.checkPassword = function () {
        if (!passwordInput || !confirmPasswordInput) return;

        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        const strengthError = document.getElementById("strength-error");
        const matchError = document.getElementById("match-error");

        let strengthValid = false;
        let matchValid = false;

        // 1. Check Strength
        if (password === "") {
            if (strengthError) strengthError.innerHTML = "";
            strengthValid = false;
        } else if (!strongPassword.test(password)) {
            if (strengthError) strengthError.innerHTML = "Password must be 8+ chars, uppercase,<br>lowercase, number & symbol";
            strengthValid = false;
        } else {
            if (strengthError) strengthError.innerHTML = "";
            strengthValid = true;
        }

        // 2. Check Match
        if (confirmPassword === "") {
            if (matchError) matchError.textContent = "";
            matchValid = false;
        } else if (password !== confirmPassword) {
            if (matchError) matchError.textContent = "Passwords do not match";
            matchValid = false;
        } else {
            if (matchError) matchError.textContent = "";
            matchValid = true;
        }

        const isValid = strengthValid && matchValid;

        if (signupBtn) {
            if (isValid) {
                signupBtn.disabled = false;
                signupBtn.classList.add("enabled");
            } else {
                signupBtn.disabled = true;
                signupBtn.classList.remove("enabled");
            }
        }
    };

    checkPassword();
}

window.handleSubmit = async function (e) {
    e.preventDefault();

    const roleEl = document.getElementById("role");
    const nameEl = document.getElementById("name");
    const emailEl = document.getElementById("email");
    const ageEl = document.getElementById("age");
    const mobileEl = document.getElementById("mobile");
    const passwordEl = document.getElementById("password");
    const confirmEl = document.getElementById("confirmPassword");

    if (!roleEl || !nameEl || !emailEl || !ageEl || !mobileEl || !passwordEl || !confirmEl) return;

    const data = {
        role: roleEl.value,
        name: nameEl.value,
        email: emailEl.value,
        age: ageEl.value,
        mobile: mobileEl.value,
        password: passwordEl.value,
        // confirmPassword not needed by server
    };

    try {
        const res = await fetch(`${API_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (result.success) {
            alert("Signup successful! Please sign in.");
            window.location.href = "signin.html";
        } else {
            alert(result.error || "Signup failed");
        }
    } catch (err) {
        console.error(err);
        alert("Server error during signup");
    }
};