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

//**API'S starts */ 

// Get Statuses on page load
document.addEventListener("DOMContentLoaded", async () => {
    await loadStatuses(); // Load status list from DB
});

// Load statuses dynamically
async function loadStatuses() {
    const statusSelect = document.getElementById("BatchStatus");

    try {
        const response = await fetch("/getStudentBatches");
        const statuses = await response.json();

        statusSelect.innerHTML = `<option value="">Select Status</option>`;

        statuses.forEach(item => {
            const option = document.createElement("option");
            option.value = item.Status;
            option.textContent = item.Status;
            statusSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Failed to fetch statuses", error);
    }
}

// Load batch codes based on selected status
async function loadBatchCodes() {
    const status = document.getElementById("BatchStatus").value;
    const batchSelect = document.getElementById("BatchCode");
    batchSelect.innerHTML = `<option value="">Select Batch</option>`;

    if (!status) return;

    try {
        const response = await fetch(`/getBatchesByStatus/${status}`);
        const batches = await response.json();

        batches.forEach(batch => {
            const option = document.createElement("option");
            option.value = batch.BatchCode;
            option.textContent = batch.BatchCode;
            batchSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading batch codes", error);
    }
}


// Get students by batch code
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
                    <td style="min-width: 125px;">
                        <select onchange="updateStudentStatus('${student.StudentID}', this.value)" style="
                    padding: 5px 10px; 
                    border: 1px solid #ccc; 
                    border-radius: 5px; 
                    background-color: #f9f9f9; 
                    font-size: 12px; 
                    transition: 0.3s ease; 
                    width: 100%;
                     box-sizing: border-box;">
                             <option value="ON Going" ${student.Status === 'ON Going' ? 'selected' : ''}>ON Going</option>
                            <option value="Completed" ${student.Status === 'Completed' ? 'selected' : ''}>Completed</option>
                            <option value="Up Coming" ${student.Status === 'Up Coming' ? 'selected' : ''}>Up Coming</option>
                        </select>
                    </td>
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
                    <td>
                        <button onclick="checkCertificate('${student.StudentID}')">Certificate</button>
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


// Update batch status for ALL students

async function updateStudentStatus(studentID, status) {
    try {
        const response = await fetch(`/updateStudentStatus`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentID, status })
        });

        const result = await response.json();
        if (result.success) {
            alert(`Status updated for Student ID: ${studentID}`);
        } if (result.success) {
            alert(`Status updated for all students in Batch Code: ${result.batchCode}`);
        }
        else {
            alert("Failed to update student status.");
        }
    } catch (error) {
        console.error("Error updating student status", error);
    }
}



//** get the certificate of the student where stun=dent idd matches */
async function checkCertificate(studentID) {
    const modal = document.getElementById("certificateModal");
    const content = document.getElementById("modalContent");

    try {
        const response = await fetch(`/certificate/${studentID}`);

        if (response.status === 404) {
            content.innerHTML = `<p>No Certificate Found for Student ID: ${studentID}</p>`;
            modal.style.display = 'block';
            return;
        }

        const contentType = response.headers.get("content-type");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        if (contentType.includes('pdf')) {
            content.innerHTML = `
                <p>Certificate for Student ID: ${studentID}</p>
                <embed src="${url}" type="application/pdf" width="100%" height="500px" />
            `;
        } else if (contentType.includes('image')) {
            content.innerHTML = `
                <p>Certificate for Student ID: ${studentID}</p>
                <img src="${url}" alt="Certificate" style="width:100%; height:auto;" />
            `;
        } else {
            content.innerHTML = `
                <p>Certificate Found. <a href="${url}" target="_blank">Download/View</a></p>
            `;
        }

        modal.style.display = 'block';

    } catch (err) {
        console.error("Error fetching certificate:", err);
        content.innerHTML = `<p>Error fetching certificate. Please try again.</p>`;
        modal.style.display = 'block';
    }
}

function closeModal() {
    document.getElementById("certificateModal").style.display = "none";
}
