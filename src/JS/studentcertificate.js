// Sidebar Toggle
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
if (sidebarToggle) {
    const menuIcon = sidebarToggle.querySelector("i");

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('show');
        if (sidebar.classList.contains('show')) {
            menuIcon.textContent = "close";
        } else {
            menuIcon.textContent = "menu";
        }
    });
}

// Profile Menu Toggle
const profileToggle = document.getElementById('profile-toggle');
const profileMenu = document.getElementById('profile-menu');

if (profileToggle) {
    profileToggle.addEventListener('click', () => {
        profileMenu.classList.toggle('show');
    });

    document.addEventListener('click', (event) => {
        if (!profileToggle.contains(event.target) && !profileMenu.contains(event.target)) {
            profileMenu.classList.remove('show');
        }
    });
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (event) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(event.target) && (!sidebarToggle || !sidebarToggle.contains(event.target))) {
            sidebar.classList.remove('show');
            if (sidebarToggle) {
                sidebarToggle.innerHTML = '<i data-lucide="menu"></i>';
                lucide.createIcons();
            }
        }
    }
});

// Set active nav-item based on current page URL
document.addEventListener("DOMContentLoaded", () => {
    const navItems = document.querySelectorAll(".nav-item");
    const currentPage = window.location.pathname.split("/").pop(); // Get current page file name

    navItems.forEach(item => {
        const linkPage = item.getAttribute("href");
        if (linkPage === currentPage) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
});


//** API'S START'S */
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        window.location.href = "/PAGES/loginpage.html";
        return;
    }

    fetch("/profile", {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to load profile");
            return res.json();
        })
        .then(data => {
            const { FullName, CertificateData, FileType } = data;

            // Show welcome message
            document.getElementById("welcome-name").textContent = `Welcome, ${FullName}`;

            const certContainer = document.getElementById("certificateContainer");

            if (CertificateData) {
                certContainer.innerHTML = `
                    <h3>Your Certificate</h3>
                    <embed src="data:application/pdf;base64,${CertificateData}" width="100%" height="500px" type="application/pdf">
                `;
            } else {
                certContainer.innerHTML = `
                    <p style="font-size: 18px; color: gray;">
                        Will be available soon after completion of your course.
                    </p>
                `;
            }
        })
        .catch(err => {
            console.error("Error loading profile:", err);
            window.location.href = "/PAGES/loginpage.html";
        });
});
