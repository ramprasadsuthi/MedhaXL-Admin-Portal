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
