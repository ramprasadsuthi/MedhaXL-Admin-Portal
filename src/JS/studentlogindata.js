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

// Search to redirect the page
function redirectToSearch() {
    const searchInput = document.getElementById('searchInput').value;
    if (searchInput) {
        window.location.href = `search.html?query=${searchInput}`;
    }
    return false;
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        redirectToSearch();
    }
}
//search on click rediretch to the search page end

//**Api's Starts here */

document.addEventListener("DOMContentLoaded", function () {
    fetchStudentLogins();
    document.getElementById("search-input").addEventListener("input", searchStudentLogins);
});

// Function to Fetch Student Login Data
function fetchStudentLogins() {
    fetch("/student-logins")
        .then(response => response.json())
        .then(data => {
            window.studentLogins = data; // Store data globally for search
            displayStudentLogins(data);
        })
        .catch(error => console.error("Error fetching data:", error));
}

// Function to Display Student Data
function displayStudentLogins(data) {
    const tableBody = document.getElementById("student-login-table");
    tableBody.innerHTML = "";

    data.forEach(student => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.can_id}</td>
            <td>${student.fullname}</td>
            <td>${student.email}</td>
            <td>
                <span class="hidden-content">********</span>
                <button class="view-btn" onclick="viewDetails(this, '${student.username}', 'username')">👁️</button>
            </td>
            <td>
                <span class="hidden-content">********</span>
                <button class="view-btn" onclick="viewDetails(this, '${student.password}', 'password')">👁️</button>
            </td>
            <td>
                <button class="delete-btn" onclick="deleteStudent(${student.can_id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to View Username or Password
function viewDetails(button, actualData, fieldType) {
    if (confirm(`Are you sure you want to view the ${fieldType}?`)) {
        const spanElement = button.previousElementSibling;
        spanElement.textContent = actualData; // Show real data
        button.style.display = "none"; // Hide 'View' button after clicking
    }
}

// Search Functionality
function searchStudentLogins() {
    const searchTerm = document.getElementById("search-input").value.toLowerCase();
    const filteredData = window.studentLogins.filter(student =>
        student.can_id.toString().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm) ||
        student.username.toLowerCase().includes(searchTerm)
    );
    displayStudentLogins(filteredData);
}

// Function to Delete a Student Login Entry
function deleteStudent(can_id) {
    if (confirm("Are you sure you want to delete this student login?")) {
        fetch(`/student-logins/${can_id}`, { method: "DELETE" })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                fetchStudentLogins(); // Refresh the table
            })
            .catch(error => console.error("Error deleting record:", error));
    }
}
