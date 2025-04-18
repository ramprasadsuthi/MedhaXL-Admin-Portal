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

//**apis starts */


// Load Course Types
document.addEventListener("DOMContentLoaded", async () => {
    await loadCourseTypes(); // Load course types initially
});

async function loadCourseTypes() {
    const courseTypeSelect = document.getElementById("CourseType");

    try {
        const response = await fetch("/getCourseTypes");
        const courseTypes = await response.json();

        courseTypeSelect.innerHTML = `<option value="">Select Course Type</option>`;

        courseTypes.forEach(item => {
            const option = document.createElement("option");
            option.value = item.CourseType;
            option.textContent = item.CourseType;
            courseTypeSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Failed to fetch course types", error);
    }
}

//Pass Selected CourseType
async function loadStatuses() {
    const courseType = document.getElementById("CourseType").value;
    const statusSelect = document.getElementById("BatchStatus");
    statusSelect.innerHTML = `<option value="">Select Status</option>`;

    if (!courseType) return;

    try {
        const response = await fetch(`/getStatusesByCourseType/${courseType}`);
        const statuses = await response.json();

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

// Use CourseType and Status
async function loadBatchCodes() {
    const courseType = document.getElementById("CourseType").value;
    const status = document.getElementById("BatchStatus").value;
    const batchSelect = document.getElementById("BatchCode");
    batchSelect.innerHTML = `<option value="">Select Batch</option>`;

    if (!courseType || !status) return;

    try {
        const response = await fetch(`/getBatches/${courseType}/${status}`);
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


//**html actions */
async function getDetails() {
    const batchID = document.getElementById("BatchCode").value;
    if (!batchID) return;

    const response = await fetch(`/getStudentsdata?batchID=${batchID}`);
    const students = await response.json();
    const tableBody = document.getElementById("studentTableBody");
    tableBody.innerHTML = "";

    if (students.length === 0) {
        alert("No data found");
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
          <td id="totalFee-${student.StudentID}">${student.TotalFee}</td>
          <td><input type="text" id="pay-${student.StudentID}" placeholder="Enter Amount"></td>
          <td id="due-${student.StudentID}">${student.TotalDue}</td>
          <td><button onclick="openPopup(${student.StudentID})" style="color: #0c7c90; border: 2px solid #0c7c90; background: transparent; padding: 8px 15px; font-size: 14px; font-weight: bold; border-radius: 5px; cursor: pointer; transition: 0.3s;">Pay</button></td> 
          <td><button onclick="getTerms(${student.StudentID})" style="color: #fff; background: #0c7c90; border: none; padding: 8px 15px; font-size: 14px; font-weight: bold; border-radius: 5px; cursor: pointer; transition: 0.3s;">View</button></td>

        </tr>`;
        tableBody.innerHTML += row;
    });
}

//**pop the student termm data */
async function getTerms(studentID) {
    const response = await fetch(`/getTerms?studentID=${studentID}`);
    const terms = await response.json();
    const modalBody = document.getElementById("termsTableBody");
    modalBody.innerHTML = "";

    if (terms.length === 0) {
        alert("No transactions found for this student.");
        return;
    }

    terms.forEach(term => {
        const row = `
        <tr>
          <td>${term.Term}</td>
          <td>${term.Name}</td>
          <td>${term.AmountPaid}</td>
          <td>${term.PaidDate}</td>
        </tr>`;
        modalBody.innerHTML += row;
    });

    document.getElementById("termsModal").style.display = "block";
}

function closeModal() {
    document.getElementById("termsModal").style.display = "none";
}
// Close Modal by Clicking Outside
window.onclick = function (event) {
    const vmodal = document.getElementById("termsModal");
    if (event.target == vmodal) {
        vmodal.style.display = "none";
    }
}


//**pop for enter term */
function openPopup(studentID) {
    const amount = document.getElementById(`pay-${studentID}`).value;
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        alert("Please enter a valid amount");
        return;
    }
    const term = prompt("Enter Term (Allowed: 2, 3, 4, 5):");

    if (term && (term == 2 || term == 3 || term == 4 || term == 5)) {
        savePayment(studentID, parseFloat(amount), term);
    } else {
        alert("Invalid Term! Only 2, 3, 4, 5 are allowed");
    }
}

//**throw errooe for the alredy extist term */
async function checkTermExists(studentID, term, amount) {
    const response = await fetch(`/checkTermExists?studentID=${studentID}&term=${term}`);
    const result = await response.json();
    if (result.exists) {
        alert("Term already exists for this student!");
    } else {
        savePayment(studentID, parseFloat(amount), term);
    }
}
//**payment done successfully */
async function savePayment(studentID, amount, term) {
    const response = await fetch("/savePayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentID, payAmount: amount, term })
    });
    const result = await response.json();
    if (result.success) {
        alert("Payment Saved Successfully!");
        getDetails();
    } else {
        alert(result.message);
    }
}
