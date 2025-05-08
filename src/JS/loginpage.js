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
  const newPass = document.getElementById("newPass1").value;
  const confirmPass = document.getElementById("newPass2").value;

  if (newPass !== confirmPass) {
    alert("Passwords do not match.");
    // Clear the password fields
    document.getElementById("newPass1").value = "";
    document.getElementById("newPass2").value = "";
    // Keep forgotCard visible
    flipTo('forgotCard');
    return;
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
        setTimeout(() => {
          window.location.reload();  // allow card flip animation to complete
        }, 500);
      } else {
        alert(data.message);
      }
    });
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
      // Clear input fields
      document.getElementById("userIdentifier").value = "";
      document.getElementById("userPassword").value = "";
      // Keep the login card visible
      flipTo('loginCard');
    }
  } catch (err) {
    console.error("Login Error:", err);
    alert("An error occurred. Please try again.");
  }
});


// Inactivity timers for forgotCard and signupCard
let forgotCardTimer;
let signupCardTimer;

function resetForgotCardTimer() {
  clearTimeout(forgotCardTimer);
  forgotCardTimer = setTimeout(() => {
    resetForgotCard();
  }, 2 * 60 * 1000); // 2 minutes
}

function resetSignupCardTimer() {
  clearTimeout(signupCardTimer);
  signupCardTimer = setTimeout(() => {
    resetSignupCard();
  }, 2 * 60 * 1000); // 2 minutes
}

function resetForgotCard() {
  // Clear all inputs in forgotCard steps
  document.getElementById("forgotPhone").value = "";
  document.getElementById("aadharInput").value = "";
  document.getElementById("batchInput").value = "";
  document.getElementById("newPass1").value = "";
  document.getElementById("newPass2").value = "";

  // Reset steps visibility
  document.getElementById("step1").style.display = "block";
  document.getElementById("step2").style.display = "none";
  document.getElementById("step3").style.display = "none";
  document.getElementById("step4").style.display = "none";

  // Reset verification variables
  verifiedPhone = "";
  verifiedAadhar = "";
  verifiedBatch = "";
  confirmedCanId = "";

  // Keep forgotCard visible
  flipTo('forgotCard');
}

function resetSignupCard() {
  clearSignupFields();
  flipTo('signupCard');
}

// Attach event listeners to reset timers on user interaction in forgotCard and signupCard
document.getElementById("forgotCard").addEventListener("mousemove", resetForgotCardTimer);
document.getElementById("forgotCard").addEventListener("keydown", resetForgotCardTimer);
document.getElementById("signupCard").addEventListener("mousemove", resetSignupCardTimer);
document.getElementById("signupCard").addEventListener("keydown", resetSignupCardTimer);

// Initialize timers on script load
resetForgotCardTimer();
resetSignupCardTimer();

function verifyForgotPhone() {
  const phone = document.getElementById("forgotPhone").value;

  alert("Please wait, verifying phone...");
  fetch("/verify-mobile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        verifiedPhone = phone;
        alert("Phone verified successfully.");
        document.getElementById("step1").style.display = "none";
        document.getElementById("step2").style.display = "block"; cvvv
      } else {
        alert(data.message);
      }
    });
}

function verifyAadhar() {
  const aadhar = document.getElementById("aadharInput").value;

  alert("Please wait, verifying Aadhaar...");
  fetch("/verify-aadhar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: verifiedPhone, aadhar })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        verifiedAadhar = aadhar;
        alert("Aadhaar verified successfully.");
        document.getElementById("step2").style.display = "none";
        document.getElementById("step3").style.display = "block";
      } else {
        alert(data.message);
      }
    });
}

function verifyBatch() {
  const batch = document.getElementById("batchInput").value;

  alert("Verifying Batch Code...");
  fetch("/verify-batch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: verifiedPhone, aadhar: verifiedAadhar, batch })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        verifiedBatch = batch;
        confirmedCanId = data.canId;
        alert("Batch verified successfully.");
        document.getElementById("step3").style.display = "none";
        document.getElementById("step4").style.display = "block";
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
        setTimeout(() => {
          window.location.reload();  // allow card flip animation to complete
        }, 500);
      } else {
        alert(data.message);
      }
    });
}


//**create new account */
let isEmailVerified = false;
let isPhoneVerified = false;

async function verifyEmail() {
  const email = document.getElementById("signupEmail").value.trim();
  if (!email) return;

  const res = await fetch("/verify-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();

  const status = document.getElementById("emailStatus");
  if (data.found) {
    status.textContent = "Email verified. Please wait...";
    status.style.color = "green";
    isEmailVerified = true;
  } else {
    status.textContent = "Email not found in records.";
    status.style.color = "red";
    isEmailVerified = false;
  }

  togglePasscodeVisibility();
}

async function verifyPhone() {
  const phone = document.getElementById("signupPhone").value.trim();
  if (!phone) return;

  const res = await fetch("/verify-phone", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  const data = await res.json();

  const status = document.getElementById("phoneStatus");
  if (data.found) {
    status.textContent = "Phone number verified.";
    status.style.color = "green";
    isPhoneVerified = true;
  } else {
    status.textContent = "Phone number not found.";
    status.style.color = "red";
    isPhoneVerified = false;
  }

  togglePasscodeVisibility();
}

function togglePasscodeVisibility() {
  const passGroup = document.getElementById("passGroup");
  passGroup.style.display = (isEmailVerified && isPhoneVerified) ? "block" : "none";
}

async function createAccount(event) {
  event.preventDefault();

  if (!isEmailVerified || !isPhoneVerified) {
    alert("Verify Email and Phone Number first.");
    // Clear signup inputs
    clearSignupFields();
    flipTo('signupCard');
    return;
  }

  const username = document.getElementById("signupUser").value.trim();
  const fullName = document.getElementById("signupFullName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const phone = document.getElementById("signupPhone").value.trim();
  const password = document.getElementById("signupPass").value.trim();

  if (!username || !fullName || !email || !phone || !password) {
    alert("Please fill all fields.");
    // Clear signup inputs
    clearSignupFields();
    flipTo('signupCard');
    return;
  }

  const canId = prompt("Enter your CAN-ID to complete registration:");
  if (!canId || !canId.trim()) {
    alert("CAN-ID is required.");
    // Clear signup inputs
    clearSignupFields();
    flipTo('signupCard');
    return;
  }

  const payload = { username, fullName, email, phone, password, canId: canId.trim() };

  try {
    const res = await fetch("/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    alert(data.message);
    if (data.success) {
      flipTo("loginCard");
      setTimeout(() => window.location.reload(), 1000);
    } else {
      // On failure, clear signup inputs and stay on signupCard
      clearSignupFields();
      flipTo('signupCard');
    }
  } catch (err) {
    console.error("Signup Error:", err);
    alert("Something went wrong.");
    clearSignupFields();
    flipTo('signupCard');
  }
}

function clearSignupFields() {
  document.getElementById("signupUser").value = "";
  document.getElementById("signupFullName").value = "";
  document.getElementById("signupEmail").value = "";
  document.getElementById("signupPhone").value = "";
  document.getElementById("signupPass").value = "";
  document.getElementById("emailStatus").textContent = "";
  document.getElementById("phoneStatus").textContent = "";
  isEmailVerified = false;
  isPhoneVerified = false;
  togglePasscodeVisibility();
}

document.getElementById("signupForm").addEventListener("submit", createAccount);