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
toggleDropdown('.Batches-menu', '.Batches-submenu', '.Batches-toggle');
toggleDropdown('.trainers-menu', '.trainers-submenu', '.trainers-toggle');
toggleDropdown('.FInance-menu', '.FInance-submenu', '.FInance-toggle');
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
    window.location.href = `Pdf_template.html?studentID=${studentID}`;
}
