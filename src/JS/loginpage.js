let wrapper = document.querySelector('.wrapper'),
    signUpLink = document.querySelector('.link .signup-link'),
    signInLink = document.querySelector('.link .signin-link');

signUpLink.addEventListener('click', () => {
    wrapper.classList.add('animated-signin');
    wrapper.classList.remove('animated-signup');
});

signInLink.addEventListener('click', () => {
    wrapper.classList.add('animated-signup');
    wrapper.classList.remove('animated-signin');
});




// **Admin Login API with Token Handling**
console.log("loginpage.js loaded");


document.getElementById("universalLoginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const identifier = document.getElementById("userIdentifier").value.trim();
    const password = document.getElementById("userPassword").value.trim();

    if (!identifier || !password) {
        return alert("Please enter all required fields.");
    }

    try {
        const res = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier, password })
        });

        console.log("Login response status:", res.status);
        const result = await res.json();
        console.log("Login response JSON:", result);

        if (res.ok && result.token) {
            localStorage.setItem("authToken", result.token);

            if (result.role === "admin") {
                window.location.href = "/PAGES/Dashboard.html";
            } else if (result.role === "student") {
                window.location.href = "/PAGES/studentdashboard.html";
            }
        }
        else {
            alert(result.message || "Login failed.");
        }
    } catch (err) {
        console.error("Login Error:", err);
        alert("An error occurred. Please try again.");
    }
});
