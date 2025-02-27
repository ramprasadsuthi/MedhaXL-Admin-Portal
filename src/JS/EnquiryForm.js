


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("enrollmentForm");
  const submitBtn = document.getElementById("submitBtn");

  if (!form || !submitBtn) {
    console.error("Form or submit button not found.");
    return;
  }

  const inputs = form.querySelectorAll("input");

  function validateForm() {
    let isValid = true;
    inputs.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
      }
    });
    submitBtn.disabled = !isValid;
  }

  inputs.forEach((input) => {
    input.addEventListener("input", validateForm);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/EnquiryForm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        form.reset();
        submitBtn.disabled = true;

        // Redirect to index.html after successful submission
        window.location.href = "../index.html";
      } else {
        alert("Error: " + (result.error || "Something went wrong"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the form.");
    }
  });
});
