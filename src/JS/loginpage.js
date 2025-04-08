const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

// Handle panel switching
signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

// Add mobile detection and handling
function isMobile() {
    return window.innerWidth <= 768;
}

// Add mobile-specific elements if needed
function setupMobileView() {
    if (isMobile()) {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (!form.querySelector('.mobile-switch')) {
                const mobileSwitch = document.createElement('div');
                mobileSwitch.className = 'mobile-switch';
                const switchButton = document.createElement('button');
                switchButton.type = 'button';
                switchButton.className = 'ghost';
                switchButton.textContent = form.closest('.sign-in-container') ?
                    'Switch to Student Login' : 'Switch to Admin Login';
                switchButton.onclick = () => {
                    container.classList.toggle('right-panel-active');
                };
                mobileSwitch.appendChild(switchButton);
                form.appendChild(mobileSwitch);
            }
        });
    }
}

// Handle resize events
window.addEventListener('resize', setupMobileView);

// Initial setup
document.addEventListener('DOMContentLoaded', setupMobileView);

// **Admin Login API with Token Handling**
document.getElementById("adminLoginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission

    const emailOrusername = document.getElementById("adminEmailOrusername").value;
    const password = document.getElementById("adminPassword").value;

    try {
        const response = await fetch("/loginpage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emailOrusername, password })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem("authToken", data.token);
            window.location.href = "/PAGES/Dashboard.html";
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred during login. Please try again.");
    }
});

let idleTimeout; // Store the timeout reference

function resetTokenTimer() {
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => {
        localStorage.removeItem("authToken");
        alert("Session expired due to inactivity. Please log in again.");
        window.location.href = "/PAGES/loginpage.html";
    }, 10 * 60 * 1000); // 10 minutes idle timeout    
}

function checkTokenExpiration() {
    const token = localStorage.getItem("authToken");
    if (token) {
        const decodedToken = parseJwt(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken && decodedToken.exp < currentTime) {
            alert("Session expired. Please log in again.");
            localStorage.removeItem("authToken");
            window.location.href = "/PAGES/loginpage.html";
        }
    }
}

// Decode JWT helper function
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Failed to parse JWT token:", error);
        return null;
    }
}

// Reset token expiration timer on user activity
["mousemove", "keypress", "click"].forEach(event =>
    document.addEventListener(event, resetTokenTimer)
);

// Start the timer and check expiration every minute
resetTokenTimer();
setInterval(checkTokenExpiration, 60 * 1000);



//**student login */
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("studentLoginForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const emailOrCanID = document.getElementById("studentEmailOrCanID").value.trim();
        const password = document.getElementById("studentPassword").value.trim();

        if (!emailOrCanID || !password) {
            alert("Please fill in both fields.");
            return;
        }

        const loginData = { emailOrCanID, password };

        try {
            const response = await fetch("/studentlogin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData)
            });

            const result = await response.json();

            if (response.ok && result.token) {
                localStorage.setItem("authToken", result.token);
                window.location.href = result.redirectTo;
            } else {
                alert(result.message || "Invalid credentials. Please check your CAN-ID, email, or password.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error logging in. Please try again.");
        }
    });
});