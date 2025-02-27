document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("searchInput").focus();
});

function redirectToSearch(event) {
    event.preventDefault(); // Prevent form submission

    const searchValue = document.getElementById("searchInput").value.trim();
    if (!searchValue) {
        alert("Please enter a name or mobile number.");
        return;
    }

    fetch(`/search?query=${searchValue}`)
        .then(response => response.json())
        .then(data => displayResults(data))
        .catch(error => console.error("Error fetching students:", error));
}

function displayResults(students) {
    const tableBody = document.getElementById("studentTableBody");
    tableBody.innerHTML = ""; // Clear previous results

    if (students.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">No students found</td></tr>`;
        return;
    }

    students.forEach(student => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.StudentID}</td>
            <td>${student.BatchCode}</td>
            <td>${student.Course}</td>
            <td>${student.FirstName}</td>
            <td>${student.LastName}</td>
            <td>${student.MobileNumber}</td>
            <td>${student.EmailID}</td>
            <td><button class="edit-btn" onclick="editStudent(${student.StudentID})">Edit</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function editStudent(studentID) {
    window.location.href = `/edit-student.html?id=${studentID}`;
}


// edit  and load student data
function editStudent(studentID) {
    fetch(`/api/students/get-student?id=${studentID}`)
        .then(response => response.json())
        .then(student => {
            document.getElementById("editStudentID").value = student.StudentID;
            document.getElementById("editFirstName").value = student.FirstName;
            document.getElementById("editLastName").value = student.LastName;
            document.getElementById("editBatchCode").value = student.BatchCode;
            document.getElementById("editCourse").value = student.Course;
            document.getElementById("editMobile").value = student.MobileNumber;
            document.getElementById("editEmail").value = student.EmailID;

            document.getElementById("editModal").style.display = "flex";
        })
        .catch(error => console.error("Error fetching student details:", error));
}

// Save updated student details
function saveChanges() {
    const studentID = document.getElementById("editStudentID").value;
    const updatedData = {
        FirstName: document.getElementById("editFirstName").value,
        LastName: document.getElementById("editLastName").value,
        BatchCode: document.getElementById("editBatchCode").value,
        Course: document.getElementById("editCourse").value,
        MobileNumber: document.getElementById("editMobile").value,
        EmailID: document.getElementById("editEmail").value
    };

    fetch(`/api/students/update-student/${studentID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        closeModal();
        location.reload(); // Refresh the page to show updated data
    })
    .catch(error => console.error("Error updating student:", error));
}

// Close modal function
function closeModal() {
    document.getElementById("editModal").style.display = "none";
}
