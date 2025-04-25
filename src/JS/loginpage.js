function flipTo(cardId) {
  document.querySelectorAll(".card").forEach(card => card.classList.remove("active"));
  document.getElementById(cardId).classList.add("active");
}

function login(event) {
  event.preventDefault();
  const username = document.getElementById("userIdentifier").value;
  const password = document.getElementById("userPassword").value;


}

function signup(event) {
  event.preventDefault();
  const username = document.getElementById("signupUser").value;
  const phone = document.getElementById("signupPhone").value;
  const pass = document.getElementById("signupPass").value;

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


//** forgot passode api and verification */
let verifiedPhone = "";
let verifiedAadhar = "";
let verifiedCanId = "";

function sendOTP() {
  const phone = document.getElementById("forgotPhone").value;

  fetch("/verify-phone", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        verifiedPhone = phone;
        alert("Your mobile number was verified successfully.");
        document.getElementById("step1").style.display = "none";
        document.getElementById("step2").style.display = "block";
      } else {
        alert(data.message);
      }
    });
}

function verifyAadhar() {
  const aadhar = document.getElementById("aadharInput").value;

  fetch("/verify-aadhar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: verifiedPhone, aadhar })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        verifiedAadhar = aadhar;
        alert("Your Aadhaar number was verified successfully.");
        document.getElementById("step2").style.display = "none";
        document.getElementById("step3").style.display = "block";
      } else {
        alert(data.message);
      }
    });
}

function resetDone() {
  const newPass = document.getElementById("newPass1").value;
  const confirmPass = document.getElementById("newPass2").value;

  if (newPass !== confirmPass) {
    return alert("Passwords do not match.");
  }

  const canId = prompt("Please confirm your CAN-ID to reset password:");

  fetch("/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone: verifiedPhone,
      aadhar: verifiedAadhar,
      canId,
      newPassword: newPass
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Password reset successful!");
        flipTo('loginCard');
      } else {
        alert(data.message);
      }
    });
}