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

let idleTimeout;
const IDLE_LIMIT = 60 * 60 * 1000; // 60 minutes

function startIdleTimer() {
    clearTimeout(idleTimeout);

    idleTimeout = setTimeout(() => {
        // Set a flag to indicate the session has expired due to inactivity
        localStorage.setItem("idleExpired", "true");
    }, IDLE_LIMIT);
}

function checkIdleExpiryOnActivity() {
    const expired = localStorage.getItem("idleExpired");

    if (expired === "true") {
        alert("Session expired due to inactivity. Please log in again.");
        localStorage.removeItem("authToken");
        localStorage.removeItem("idleExpired");
        window.location.href = "/PAGES/loginpage.html";
    } else {
        startIdleTimer(); // Reset the timer if still active
    }
}

// Events that reset the timer or handle expiration
["mousemove", "keypress", "click"].forEach(event =>
    document.addEventListener(event, checkIdleExpiryOnActivity)
);

// Start the timer on page load
document.addEventListener("DOMContentLoaded", () => {
    startIdleTimer();
});




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

                const redirectTo = result.redirectTo || "/PAGES/studentdashboard.html";
                console.log("Redirecting to:", redirectTo);
                window.location.href = redirectTo;
            }

            else {
                alert(result.message || "Invalid credentials. Please check your CAN-ID, email, or password.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error logging in. Please try again.");
        }
    });
});