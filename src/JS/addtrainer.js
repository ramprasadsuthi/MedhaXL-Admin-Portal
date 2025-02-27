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
