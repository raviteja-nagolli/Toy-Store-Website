const API_URL = `http://${window.location.hostname}:5000`;

// Check Session on Load (similar to main.js, or we can just import main.js? But signin.html didn't import main.js properly in my plan.
// Actually signin.html imports signin.js. I should include the session check here too or refactor.
// For simplicity, let's include it.

async function checkSession() {
    try {
        const res = await fetch(`${API_URL}/me`, { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        if (data.loggedIn) {
            // Already logged in? Stay here or redirect to home? 
            // If we are on signin page, maybe redirect to home.
            window.location.href = "index.html";
        }
    } catch (err) {
        console.error("Session check failed", err);
    }
}
checkSession();

function togglePassword() {
    const input = document.getElementById("password");
    if (input) {
        input.type = input.type === "password" ? "text" : "password";
    }
}

async function handleSignin(e) {
    e.preventDefault();

    const emailEl = document.getElementById("email");
    const passwordEl = document.getElementById("password");
    // const roleEl = document.getElementById("role"); // Server doesn't strictly need role for signin unless we have separate collections. But usually email is unique.
    // The previous form had role select. server /signin endpoint only uses email/password.
    // So role is ignored by server /signin.

    if (!emailEl || !passwordEl) return;

    const data = {
        email: emailEl.value,
        password: passwordEl.value
    };

    try {
        const res = await fetch(`${API_URL}/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Important for cookies
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (result.success) {
            // alert("Signin successful!");
            window.location.href = "index.html";
        } else {
            alert(result.error || "Signin failed");
        }
    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}

// Attach listener
const form = document.querySelector(".signin-form");
if (form) {
    form.addEventListener("submit", handleSignin);
}
