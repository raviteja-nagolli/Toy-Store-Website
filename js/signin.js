const API_URL = `http://${window.location.hostname}:5000`;

async function checkSession() {
    try {
        const res = await fetch(`${API_URL}/me`, { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        if (data.loggedIn) {
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

    if (!emailEl || !passwordEl) return;

    const data = {
        email: emailEl.value,
        password: passwordEl.value
    };

    try {
        const res = await fetch(`${API_URL}/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (result.success) {
            window.location.href = "index.html";
        } else {
            alert(result.error || "Signin failed");
        }
    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}

const form = document.querySelector(".signin-form");
if (form) {
    form.addEventListener("submit", handleSignin);
}
