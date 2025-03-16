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

// Search to redirect the page
function redirectToSearch() {
	const searchInput = document.getElementById('searchInput').value;
	if (searchInput) {
		window.location.href = `search.html?query=${searchInput}`;
	}
	return false;
}

function handleKeyPress(event) {
	if (event.key === 'Enter') {
		redirectToSearch();
	}
}
//search on click rediretch to the search page end

// apis startes

//
document.addEventListener("DOMContentLoaded", () => {
	const trainerForm = document.getElementById("trainerForm");

	trainerForm.addEventListener("submit", async (event) => {
		event.preventDefault(); // Prevent page reload

		// Collect form data
		const trainerData = {
			trainerId: document.getElementById("trainerId").value.trim(),
			trainerName: document.getElementById("trainerName").value.trim(),
			phone: document.getElementById("phone").value.trim(),
			skill1: document.getElementById("skill1").value.trim(),
			skill2: document.getElementById("skill2").value.trim(),
			skill3: document.getElementById("skill3").value.trim(),
			status: document.getElementById("status").value
		};

		try {
			// Send POST request to server
			const response = await fetch("/trainers", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(trainerData)
			});

			const result = await response.json();

			if (response.ok) {
				alert(" Trainer added successfully!");
				trainerForm.reset(); // Reset form after submission
			} else {
				alert(` Error: ${result.message}`);
			}
		} catch (error) {
			console.error("Error:", error);
			alert("Failed to add trainer. Please try again.");
		}
	});
});
