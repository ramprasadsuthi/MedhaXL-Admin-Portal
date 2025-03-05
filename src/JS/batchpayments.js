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

//**apis starts */

//**get the batch code */
document.addEventListener("DOMContentLoaded", () => {
    fetchBatches();
});

async function fetchBatches() {
    const response = await fetch("/getBatches");
    const batches = await response.json();
    const select = document.getElementById("batch");
    batches.filter(batch => batch.Status.toLowerCase() === "active").forEach(batch => {
        const option = document.createElement("option");
        option.value = batch.BatchID;
        option.textContent = `${batch.BatchID} - ${batch.CourseName} (${batch.Status})`;
        select.appendChild(option);
    });
}
//**html actions */
async function getDetails() {
    const batchID = document.getElementById("batch").value;
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
          <td><button onclick="openPopup(${student.StudentID})">Pay</button></td>
           <td>
            <button onclick="getTerms(${student.StudentID})">View</button>
          </td>
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
    const term = prompt("Enter Term:");
    if (term) {
        savePayment(studentID, parseFloat(amount), term);
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
