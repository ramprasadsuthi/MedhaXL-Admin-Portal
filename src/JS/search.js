let currentPage = 1;
const studentsPerPage = 10;
let students = [];

window.onload = async function () {
	const urlParams = new URLSearchParams(window.location.search);
	const query = urlParams.get("query");

	if (query) {
		document.getElementById("searchInput").value = query;

		try {
			const response = await fetch(`/search?query=${query}`);
			students = await response.json();

			if (students.length === 0) {
				alert("No Data Found");
			}
			displayStudents();
		} catch (error) {
			console.error("Failed to fetch students:", error);
		}
	}
};

function displayStudents() {
	const tableBody = document.getElementById("studentTableBody");
	tableBody.innerHTML = "";

	const startIndex = (currentPage - 1) * studentsPerPage;
	const endIndex = Math.min(startIndex + studentsPerPage, students.length);
	const paginatedStudents = students.slice(startIndex, endIndex);

	paginatedStudents.forEach((student) => {
		const row = `
            <tr>
                <td contenteditable="false">${student.StudentID}</td>
                <td contenteditable="false">${student.BatchCode}</td>
                <td contenteditable="false">${student.Course}</td>
                <td contenteditable="false">${student.FirstName}</td>
                <td contenteditable="false">${student.LastName}</td>
                <td contenteditable="false">${student.MobileNumber}</td>
                <td contenteditable="false">${student.EmailID}</td>
                <td>
                    <button onclick="editRow(this)">Edit</button>
                    <button onclick="saveRow(this, ${student.StudentID})" style="display:none;">Update</button>
                </td>
            </tr>`;

		tableBody.insertAdjacentHTML("beforeend", row);
	});

	document.getElementById("prevBtn").disabled = currentPage === 1;
	document.getElementById("nextBtn").disabled = endIndex >= students.length;
}

function prevPage() {
	if (currentPage > 1) {
		currentPage--;
		displayStudents();
	}
}

function nextPage() {
	if (currentPage * studentsPerPage < students.length) {
		currentPage++;
		displayStudents();
	}
}

function editRow(button) {
	const row = button.closest("tr");
	const cells = row.querySelectorAll("td[contenteditable]");

	cells.forEach((cell) => {
		cell.contentEditable = "true";
		cell.style.backgroundColor = "#f0f0f0";
	});

	button.style.display = "none";
	row.querySelector("button:nth-of-type(2)").style.display = "inline";
}

async function saveRow(button, Id) {
	const row = button.closest("tr");
	const cells = row.querySelectorAll("td[contenteditable]");
	const updatedData = {
		StudentID: cells[0].innerText.trim(), // New StudentID
		BatchCode: cells[1].innerText.trim(),
		Course: cells[2].innerText.trim(),
		FirstName: cells[3].innerText.trim(),
		LastName: cells[4].innerText.trim(),
		MobileNumber: cells[5].innerText.trim(),
		EmailID: cells[6].innerText.trim(),
	};

	try {
		const response = await fetch(`/update/${Id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(updatedData),
		});

		if (response.ok) {
			alert("Changes Done Successfully!");
			cells.forEach((cell) => {
				cell.contentEditable = "false";
				cell.style.backgroundColor = "";
			});
			button.style.display = "none";
			row.querySelector("button:nth-of-type(1)").style.display = "inline";
		} else {
			alert("Failed to update!");
		}
	} catch (error) {
		console.error("Failed to update:", error);
		alert("An error occurred!");
	}
}
