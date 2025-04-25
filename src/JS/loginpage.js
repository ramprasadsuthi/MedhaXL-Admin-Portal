function flipTo(cardId) {
    document.querySelectorAll(".card").forEach(card => card.classList.remove("active"));
    document.getElementById(cardId).classList.add("active");
  }
  
  function login(event) {
    event.preventDefault();
    const username = document.getElementById("userIdentifier").value;
    const password = document.getElementById("userPassword").value;
  
    if (username && password) {
      alert("Login successful");
    } else {
      alert("Please enter username and passcode.");
    }
  }
  
  function signup(event) {
    event.preventDefault();
    const username = document.getElementById("signupUser").value;
    const phone = document.getElementById("signupPhone").value;
    const pass = document.getElementById("signupPass").value;
  
    if (username && phone && pass) {
      alert("Signup successful");
      flipTo("loginCard");
    } else {
      alert("Please fill all fields.");
    }
  }
  
  function sendOTP() {
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
  }
  
  function verifyOTP() {
    document.getElementById("step2").style.display = "none";
    document.getElementById("step3").style.display = "block";
  }
  
  function resetDone() {
    const pass1 = document.getElementById("newPass1").value;
    const pass2 = document.getElementById("newPass2").value;
  
    if (pass1 === pass2 && pass1.length > 0) {
      alert("Password reset successfully!");
      flipTo("loginCard");
      document.getElementById("step1").style.display = "block";
      document.getElementById("step2").style.display = "none";
      document.getElementById("step3").style.display = "none";
    } else {
      alert("Passwords do not match or are empty.");
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
