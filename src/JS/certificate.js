const form = document.getElementById("uploadForm");

form.onsubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const response = await fetch("/upload", {
        method: "POST",
        body: formData
    });

    const message = await response.text();
    alert(message);
};
