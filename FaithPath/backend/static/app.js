// REGISTER
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const response = await fetch("/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById("message").innerText = data.message;
            // Redirect to login page
            window.location.href = "/login";
        } else {
            document.getElementById("message").innerText = data.error;
        }
    });
}
// LOGOUT
function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
}

// Check if logged in on home page
if (window.location.pathname === "/") {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login";
    }
}
