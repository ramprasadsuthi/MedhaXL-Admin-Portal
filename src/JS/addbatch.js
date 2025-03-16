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

//**course dropdown list */
document.addEventListener("DOMContentLoaded", function () {
    fetch("/courses") // API Call to fetch courses
        .then(response => response.json())
        .then(data => {
            const courseDropdown = document.getElementById("course"); // Match ID
            data.forEach(course => {
                let option = document.createElement("option");
                option.value = course.coursename; // Set coursename as value
                option.textContent = course.coursename; // Display coursename
                courseDropdown.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching courses:", error));
});

//**!course dropdown */
//**add batches */
async function addBatch() {
    const batchID = document.getElementById("BatchID").value;
    const courseName = document.getElementById("course").value;
    const duration = document.getElementById("Duration").value;
    const trainer = document.getElementById("Trainer").value;
    const status = document.getElementById("Status").value;

    if (!courseName) {
        document.getElementById("courseError").innerText = "Please select a course";
        return false;
    } else {
        document.getElementById("courseError").innerText = "";
    }

    const batch = {
        BatchID: batchID,
        CourseName: courseName,
        Duration: duration,
        Trainer: trainer,
        Status: status
    };

    try {
        const response = await fetch("/addBatch", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(batch)
        });

        if (response.ok) {
            alert("Batch Added Successfully!");
            window.location.reload();
        } else {
            alert("Failed to Add Batch");
        }
    } catch (error) {
        console.error("Error adding batch:", error);
        alert("Something went wrong!");
    }
    return false;
}

//**!add batche */