function switchCard(cardId) {
    // Remove 'active' class from all cards
    document.querySelectorAll(".card").forEach(card => card.classList.remove("active"));
    // Add 'active' class to the specified card
    document.getElementById(cardId).classList.add("active");
}

function login() {
    // Perform login action (add actual login logic here)
    // No alert; just transition to the next card or page after success
    switchCard("loginCard");  // Example: After login, show the login card again or transition
}

function signup() {
    // Perform signup action (add actual signup logic here)
    // No alert; just transition to the next card or page after success
    switchCard("loginCard");  // Example: After signup, show the login card again or transition
}

function sendOTP() {
    // Hide step 1 (Phone input) and show step 2 (OTP input)
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
}

function verifyOTP() {
    // Hide step 2 (OTP input) and show step 3 (New passcode input)
    document.getElementById("step2").style.display = "none";
    document.getElementById("step3").style.display = "block";
}

function resetDone() {
    const pass1 = document.getElementById("newPass1").value;
    const pass2 = document.getElementById("newPass2").value;
    
    if (pass1 === pass2 && pass1.length > 0) {
      
        switchCard("loginCard");  
        document.getElementById("step1").style.display = "block";
        document.getElementById("step2").style.display = "none";
        document.getElementById("step3").style.display = "none";
    } 
}

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
