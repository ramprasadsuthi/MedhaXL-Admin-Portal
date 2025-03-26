const tabs = document.querySelectorAll('.tabs button');
const contents = document.querySelectorAll('.tab-content');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

function showReEnter(type) {
    const value = document.getElementById(type).value;
    const confirmField = document.getElementById('confirm-' + type);
    if (value.trim() !== "") {
        confirmField.classList.remove('hidden');
    } else {
        confirmField.classList.add('hidden');
    }
}

function registerAdmin() {
    const adminUsername = document.getElementById('admin-username').value;
    alert('New Admin Registered: ' + adminUsername);
}

function registerStudent() {
    const studentUsername = document.getElementById('student-username').value;
    alert('New Student Registered: ' + studentUsername);
}

//  update the passwaord


document.getElementById("email").addEventListener("input", checkEmail);
document.getElementById("username").addEventListener("input", checkUsername);
document.getElementById("current-password").addEventListener("input", checkPassword);

async function checkEmail() {
    const email = document.getElementById("email").value;
    const emailError = document.getElementById("email-error");
    emailError.textContent = "";

    if (!email) return;

    const response = await fetch("/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });

    const result = await response.json();

    if (!result.success) {
        emailError.textContent = "Email not found.";
        document.getElementById("username").disabled = true;
    } else {
        document.getElementById("username").disabled = false;
    }
}

async function checkUsername() {
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const usernameError = document.getElementById("username-error");
    usernameError.textContent = "";

    if (!username) return;

    const response = await fetch("/check-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username })
    });

    const result = await response.json();

    if (!result.success) {
        usernameError.textContent = "Incorrect username.";
        document.getElementById("current-password").disabled = true;
    } else {
        document.getElementById("current-password").disabled = false;
    }
}

async function checkPassword() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("current-password").value;
    const passwordError = document.getElementById("password-error");
    passwordError.textContent = "";

    if (!password) return;

    const response = await fetch("/check-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (!result.success) {
        passwordError.textContent = "Incorrect password.";
        document.getElementById("new-password").disabled = true;
    } else {
        document.getElementById("new-password").disabled = false;
        document.querySelector(".submit").disabled = false;
    }
}

async function updateSecurity() {
    console.log("Button Clicked");
    const email = document.getElementById("email").value;
    const newPassword = document.getElementById("new-password").value;
    const updateError = document.getElementById("update-error");
    const successMessage = document.getElementById("success-message");

    if (!newPassword) {
        updateError.textContent = "Please enter a new password.";
        return;
    }

    const response = await fetch("/update-security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword })
    });

    const result = await response.json();
    console.log("Response:", result);

    if (result.success) {
        successMessage.textContent = "Changes done successfully. Now you can log in with the new password.";
        updateError.textContent = "";
    } else {
        updateError.textContent = "Failed to update security settings.";
    }
}
