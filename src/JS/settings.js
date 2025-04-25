document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tabs button");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));

            // Add active class to the clicked tab and the corresponding content
            tab.classList.add("active");
            document.getElementById(tab.dataset.tab).classList.add("active");
        });
    });
});

//**create the student logging */
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("registerStudentBtn").addEventListener("click", async function (event) {
        event.preventDefault(); // Prevent form submission

        const studentData = {
            can_id: document.getElementById("student-CAN-ID").value,
            fullname: document.getElementById("student-fullname").value,
            email: document.getElementById("student-email").value,
            phone: document.getElementById("student-phone").value,
            username: document.getElementById("student-username").value,
            password: document.getElementById("student-password").value
        };

        try {
            const response = await fetch("/new-register-student", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(studentData)
            });

            const result = await response.json();
            alert(result.message); // Show success or error message
        } catch (error) {
            console.error("Error:", error);
            alert("Error registering student");
        }
    });
});



//**Admin Details */
async function fetchAdminDetails(userId) {
    try {
        const response = await fetch(`/getAdminDetails?userId=${userId}`); // Send userId in URL
        const data = await response.json();

        if (data.success) {
            document.getElementById("profile-username").value = data.username;
            document.getElementById("profile-email").value = data.email;
        } else {
            console.error("Failed to fetch user details:", data.message);
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
}

// Function to save updated profile details
async function saveProfile() {
    const updatedUsername = document.getElementById("profile-username").value;
    const updatedEmail = document.getElementById("profile-email").value;

    try {
        const response = await fetch("/updateAdminDetails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: loggedInUserId, // Send the logged-in user ID
                username: updatedUsername,
                email: updatedEmail
            })
        });

        const result = await response.json();

        if (result.success) {
            alert("Profile updated successfully!");
        } else {
            alert("Failed to update profile: " + result.message);
        }
    } catch (error) {
        console.error("Error updating profile:", error);
    }
}


// Example Usage: Set logged-in user ID dynamically
const loggedInUserId = 1; // Change based on session or authentication
window.onload = () => fetchAdminDetails(loggedInUserId);

//**Admin Details */


// Register Admin
function registerAdmin() {
    const adminUsername = document.getElementById("admin-username").value.trim();
    const adminPassword = document.getElementById("admin-password").value.trim();

    if (!adminUsername || !adminPassword) {
        alert("Please enter both username and password for the admin.");
        return;
    }

    alert("New Admin Registered: " + adminUsername);
}

// Register Student
function registerStudent() {
    const studentUsername = document.getElementById("student-username").value.trim();
    const studentPassword = document.getElementById("student-password").value.trim();

    if (!studentUsername || !studentPassword) {
        alert("Please enter both username and password for the student.");
        return;
    }

    alert("New Student Registered: " + studentUsername);
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
        emailError.textContent = "Your Email doesn't exist";
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
        usernameError.textContent = "Invalid username";
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
        passwordError.textContent = "Your password is Incorrect";
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
        successMessage.textContent = "Update's Done. LOGIN With New Password.";
        successMessage.classList.add("success");
        updateError.textContent = "";

        // Redirect to login page after 2 seconds
        setTimeout(() => {
            window.location.href = "/PAGES/loginpage.html";
        }, 2000);

    } else {
        updateError.textContent = "Failed to update security settings.";
    }
}
