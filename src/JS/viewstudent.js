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
//**endn the side bat and navbar actions */
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/getBatches");
        const batches = await response.json();

        const batchDropdown = document.getElementById("BatchCode");

        batches.forEach(batch => {
            const option = document.createElement("option");
            option.value = batch.BatchID;
            option.textContent = batch.BatchID;
            batchDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Failed to fetch batches", error);
    }
});

async function getStudents() {
    const batchCode = document.getElementById("BatchCode").value;

    if (!batchCode) return;

    try {
        const response = await fetch(`/getStudents/${batchCode}`);
        const students = await response.json();

        const tbody = document.getElementById("studentTableBody");
        tbody.innerHTML = "";
        if (students.length === 0) {
            alert("No student data found for the selected batch code.");
            return;
        }

        students.forEach(student => {
            const row = `
                <tr>
                    <td>${student.StudentID}</td>
                    <td>${student.BatchCode}</td>
                    <td>${student.Course}</td>
                    <td>${student.FirstName} ${student.LastName}</td>
                    <td>${student.MobileNumber}</td>
                    <td>${student.CourseFee}</td>
                    <td>${student.DiscountAppiled}</td>
                    <td>${student.TotalFee}</td>
                    <td>${student.TotalDue}</td>
                    <td>
                        <button onclick="getDetails('${student.StudentID}')">Get Details</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error("Failed to fetch students", error);
    }
}

function getDetails(studentID) {
    window.location.href = `getpdf.html?studentID=${studentID}`;
}
