// Function to check the validity of the JWT token stored in localStorage
function checkToken() {
    const token = localStorage.getItem("authToken");

    if (!token) {
        redirectToLogin("No token found. Please log in.");
        return;
    }

    const decodedToken = parseJwt(token);
    if (!decodedToken || !decodedToken.exp) {
        redirectToLogin("Invalid session. Please log in again.");
        return;
    }

    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp < currentTime) {
        localStorage.removeItem("authToken");
        redirectToLogin("Session expired. Please log in again.");
    }
}

// Function to decode JWT safely
function parseJwt(token) {
    try {
        const base64Url = token.split(".")[1];
        if (!base64Url) return null;

        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
    }
}

// Redirect to login with an optional alert message
function redirectToLogin(message) {
    if (message) alert(message);
    window.location.href = "/PAGES/loginpage.html";
}

// Call checkToken when the page loads
document.addEventListener("DOMContentLoaded", checkToken);
