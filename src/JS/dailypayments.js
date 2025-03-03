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
          <td><input type="text" value="${student.TotalFee}" onchange="updateTotalDue(this, ${student.CourseFee}, ${student.DiscountApplied}, ${student.StudentID})"></td>
          <td id="due-${student.StudentID}">${student.TotalDue}</td>
          <td><button onclick="savePayment(${student.StudentID})">Update</button></td>
        </tr>
      `;
        tableBody.innerHTML += row;
    });
}

function updateTotalDue(input, courseFee, discount, studentID) {
    const totalFee = parseFloat(input.value);
    const totalDue = courseFee - discount - totalFee;
    document.getElementById(`due-${studentID}`).textContent = totalDue;
}

async function savePayment(studentID) {
    const totalFee = document.querySelector(`input[onchange*='${studentID}']`).value;
    const response = await fetch("/savePayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentID, totalFee })
    });
    const result = await response.json();
    if (result.success) {
        alert("Payment Saved Successfully!");
        getDetails();
    }
}