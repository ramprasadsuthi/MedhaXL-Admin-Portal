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
toggleDropdown('.courses-menu', '.courses-submenu', '.courses-toggle');
toggleDropdown('.Batches-menu', '.Batches-submenu', '.Batches-toggle');
toggleDropdown('.trainers-menu', '.trainers-submenu', '.trainers-toggle');
toggleDropdown('.FInance-menu', '.FInance-submenu', '.FInance-toggle');
toggleDropdown('.certificate-menu', '.certificate-submenu', '.certificate-toggle');



//**apis starts here */

const form = document.getElementById("uploadForm");
const pdfViewer = document.getElementById("pdfViewer");
const downloadBtn = document.getElementById("downloadBtn");
const whatsappBtn = document.getElementById("whatsappBtn");
const certificateView = document.getElementById("certificateView");

form.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
        const response = await fetch("/upload", {
            method: "POST",
            body: formData,
        });

        const message = await response.text();
        alert(message);
        form.reset();
    } catch (error) {
        console.error("Upload Error:", error);
        alert("Upload Failed: " + error.message);
    }
};

async function searchCertificate() {
    const studentID = document.getElementById("searchID").value;
    if (!studentID) {
        alert("Please Enter Student ID");
        return;
    }

    try {
        const response = await fetch(`/certificate/${studentID}`);
        if (response.ok) {
            pdfViewer.src = `/certificate/${studentID}`;
            downloadBtn.href = `/certificate/${studentID}`;
            certificateView.style.display = "block";

            whatsappBtn.onclick = () => {
                const message = `Your Certificate Download Link: http://localhost:3000/certificate/${studentID}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
            };
        } else {
            alert("No Certificate Found for the provided Student ID");
            certificateView.style.display = "none";
        }
    } catch (error) {
        console.error("Search Error:", error);
        alert("Search Failed: " + error.message);
    }
}
