// Sidebar Toggle
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
toggleDropdown('.trainers-menu', '.trainers-submenu', '.trainers-toggle');

// Search to redirect the page
function handleKeyPress(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission
        redirectToSearch();
    }
}

function redirectToSearch() {
    const query = document.getElementById("searchInput").value.trim();
    if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    } else {
        alert("Please enter a search query.");
    }
    return false; // Prevent default form submission
}

//**Api's Starts here */

//**Display the total students */
document.addEventListener("DOMContentLoaded", function () {
	fetchTotalStudents();
	fetchTotalEnquiries();
});

// Function to get total students from the backend
function fetchTotalStudents() {
	fetch("/total-students")
		.then((response) => response.json())
		.then((data) => {
			document.getElementById("totalStudents").textContent = data.totalStudents || 0;
		})
		.catch((error) => console.error("Error fetching total students:", error));
}
// total students end

// Function to fetch total enquiries
function fetchTotalEnquiries() {
	fetch("/total-enquiries")
		.then(response => response.json())
		.then(data => {
			document.getElementById("totalEnquiries").textContent = data.totalEnquiries || 0;
		})
		.catch(error => console.error("Error fetching total enquiries:", error));
}
//TotalEnquiries,,,,, end

//LatestStudents Api
document.addEventListener("DOMContentLoaded", function () {
	fetchLatestStudents();
});

function fetchLatestStudents() {
	fetch("/latest-students")
		.then(response => response.json())
		.then(data => {
			const tableBody = document.getElementById("latestStudents");
			tableBody.innerHTML = ""; // Clear previous entries

			data.forEach(student => {
				const row = document.createElement("tr");
				row.innerHTML = `
                    <td>${student.StudentID}</td>
                    <td>${student.BatchCode}</td>
                    <td>${student.FullName}</td>
                    <td>${student.MobileNumber}</td>
                    <td>${student.Course}</td>
                    <td>${student.City}</td>
                `;
				tableBody.appendChild(row);
			});
		})
		.catch(error => console.error("Error fetching latest students:", error));
}
//end,,,the LatestStudents

//**GET THE LATEST 10 ENQURIES API */
document.addEventListener("DOMContentLoaded", function () {
	fetchLatestEnquiries();
});

function fetchLatestEnquiries() {
	fetch("/latest-enquiries")
		.then(response => response.json())
		.then(data => {
			const tableBody = document.getElementById("latestEnquiries");
			tableBody.innerHTML = ""; // Clear previous entries

			data.forEach((enquiry, index) => {
				const row = document.createElement("tr");
				row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${enquiry.name}</td>
                    <td>${enquiry.phone}</td>
                    <td>${enquiry.course}</td>
                    <td>${enquiry.city}</td>
                `;
				tableBody.appendChild(row);
			});
		})
		.catch(error => console.error("Error fetching latest enquiries:", error));
}
//** END,,,,,GET THE LATEST 10 ENQURIES API  */

//**excel  download api */
// Fetch Batch Codes from Server
async function fetchBatchCodes() {
	const response = await fetch("/get-batch-codes");
	const data = await response.json();

	const dropdown = document.getElementById("batchCodeDropdown");
	dropdown.innerHTML = `<option value="">Select Batch Code</option>`; // Reset dropdown

	data.forEach(batch => {
		const option = document.createElement("option");
		option.value = batch.BatchCode;
		option.textContent = batch.BatchCode;
		dropdown.appendChild(option);
	});
}
//**End the batch code fetch api */

// Download Excel File for Selected Batch
function downloadExcel() {
	const batchCode = document.getElementById("batchCodeDropdown").value;
	if (!batchCode) {
		alert("Please select a batch code.");
		return;
	}
	window.location.href = `http://localhost:3000/export-students?batchCode=${batchCode}`;
}

// Load batch codes on page load
window.onload = fetchBatchCodes;
// end teh excel downloaded code

// view content on screen pop up 
let studentsData = []; // Store all students data
let currentPage = 0;
const pageSize = 10;

async function viewStudents() {
	const batchCode = document.getElementById("batchCodeDropdown").value;
	if (!batchCode) {
		alert("Please select a batch code!");
		return;
	}

	try {
		const response = await fetch(`/getstudents?batchCode=${batchCode}`);
		if (!response.ok) throw new Error("Failed to fetch students.");
		studentsData = await response.json();

		// Display student count
		document.getElementById("studentCount").innerText = `Total Students: ${studentsData.length}`;

		if (studentsData.length === 0) {
			alert("No students found for this batch.");
			return;
		}

		currentPage = 0;
		displayStudents();
		document.getElementById("studentModal").style.display = "block";
	} catch (error) {
		console.error("Error:", error);
		alert("Error fetching students.");
	}
}

// Function to display students (pagination)
function displayStudents() {
	const tableBody = document.getElementById("studentTableBody");
	tableBody.innerHTML = "";

	const start = currentPage * pageSize;
	const end = start + pageSize;
	const studentsToShow = studentsData.slice(start, end);

	studentsToShow.forEach(student => {
		const row = `<tr>
			<td>${student.StudentID}</td>
			<td>${student.FirstName}</td>
			<td>${student.LastName}</td>
			<td>${student.Course}</td>
			<td>${student.MobileNumber}</td>
			<td>${student.EmailID}</td>
		</tr>`;
		tableBody.innerHTML += row;
	});

	// Update pagination buttons
	document.getElementById("prevBtn").disabled = currentPage === 0;
	document.getElementById("nextBtn").disabled = end >= studentsData.length;
}

// Pagination Controls
function nextPage() {
	if ((currentPage + 1) * pageSize < studentsData.length) {
		currentPage++;
		displayStudents();
	}
}

function prevPage() {
	if (currentPage > 0) {
		currentPage--;
		displayStudents();
	}
}

// Close Modal
function closeModal() {
	document.getElementById("studentModal").style.display = "none";
}
// end the view content on screen pop up 
