const form = document.getElementById("uploadForm");

form.onsubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    try {
        const response = await fetch("/upload", {
            method: "POST",
            body: formData
        });

        const message = await response.text();
        alert(message);
    } catch (error) {
        console.error("Upload Error:", error);
        alert("Failed to Upload Certificate");
    }
};