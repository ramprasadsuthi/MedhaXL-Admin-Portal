// Sidebar Toggle sidebar
document.querySelector('.menu-icon').addEventListener('click', function () {
	document.querySelector('.sidebar').classList.toggle('show');
	// Toggle between 'menu' and 'cancel' icon
	if (this.textContent === "menu") {
		this.textContent = "cancel";
	} else {
		this.textContent = "menu";
	}
});


// Select elements
const notificationIcon = document.querySelector('.notification-icon');
const notificationDropdown = document.querySelector('.notification-dropdown');
const profileIcon = document.querySelector('.profile-icon');
const profileDropdown = document.querySelector('.profile-dropdown');

// Toggle notification dropdown
notificationIcon.addEventListener('click', function (event) {
	notificationDropdown.classList.toggle('show');
	profileDropdown.classList.remove('show'); // Close profile if open
	event.stopPropagation();
});

// Toggle profile dropdown
profileIcon.addEventListener('click', function (event) {
	profileDropdown.classList.toggle('show');
	notificationDropdown.classList.remove('show'); // Close notifications if open
	event.stopPropagation();
});

// Close dropdowns when clicking outside
window.addEventListener('click', function () {
	notificationDropdown.classList.remove('show');
	profileDropdown.classList.remove('show');
});

// Prevent closing when clicking inside the dropdowns
notificationDropdown.addEventListener('click', function (event) {
	event.stopPropagation();
});

profileDropdown.addEventListener('click', function (event) {
	event.stopPropagation();
});

//**end profile and notification */

// Dropdown Toggle Function
function toggleDropdown(menuSelector, submenuSelector, iconSelector) {
    document.querySelector(menuSelector).addEventListener('click', function () {
        document.querySelector(submenuSelector).classList.toggle('show');
        document.querySelector(iconSelector).textContent =
            document.querySelector(submenuSelector).classList.contains('show') ? 'expand_less' : 'expand_more';
    });
}

// Initialize dropdowns
toggleDropdown('.students-menu', '.students-submenu', '.students-toggle');
toggleDropdown('.courses-menu', '.courses-submenu', '.courses-toggle');
toggleDropdown('.Batches-menu', '.Batches-submenu', '.Batches-toggle');
toggleDropdown('.trainers-menu', '.trainers-submenu', '.trainers-toggle');
toggleDropdown('.FInance-menu', '.FInance-submenu', '.FInance-toggle');
toggleDropdown('.certificate-menu', '.certificate-submenu', '.certificate-toggle');











document.getElementById("courseForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const courseid = document.getElementById("courseid").value.trim();
    const coursename = document.getElementById("coursename").value.trim();
    const duration = document.getElementById("duration").value.trim();

    // Validate input fields
    if (!courseid || !coursename || !duration || isNaN(duration)) {
        displayMessage("All fields are required and duration must be a number", "red");
        return;
    }

    try {
        const response = await fetch("/addcourse", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseid, coursename, duration })
        });

        const data = await response.json(); // Parse JSON response
        if (!response.ok) throw new Error(data.message);

        displayMessage(data.message, "green");
        document.getElementById("courseForm").reset(); // Clear form after successful submission
    } catch (error) {
        displayMessage("Error: " + error.message, "red");
    }
});

function displayMessage(msg, color) {
    const messageElem = document.getElementById("message");
    messageElem.textContent = msg;
    messageElem.style.color = color;
}


async function loadCourses() {
    try {
        const response = await fetch("/getAllcourses");
        const courses = await response.json();

        const tableBody = document.getElementById("courseTableBody");
        tableBody.innerHTML = "";

        courses.forEach(course => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${course.courseid}</td>
                <td>${course.coursename}</td>
                <td>${course.duration}</td>
                <td><button class="delete-btn" onclick="deleteCourse('${course.courseid}')">Delete</button></td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading courses:", error);
    }
}

async function deleteCourse(courseid) {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
        const response = await fetch(`/deletecourse/${courseid}`, { method: "DELETE" });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message);
        alert(data.message);
        loadCourses();
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Load courses when the page loads
document.addEventListener("DOMContentLoaded", loadCourses);
