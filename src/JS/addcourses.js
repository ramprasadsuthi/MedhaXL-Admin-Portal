// Sidebar Toggle sidebar
document.querySelector('.menu-icon').addEventListener('click', function () {
    document.querySelector('.sidebar').classList.toggle('show');
});


// Profile Dropdown Toggle
document.querySelector('.profile-icon').addEventListener('click', function () {
    document.querySelector('.profile-dropdown').classList.toggle('show');
});

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
