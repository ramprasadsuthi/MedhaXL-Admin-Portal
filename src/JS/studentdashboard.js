// Sidebar Toggle
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
const menuIcon = sidebarToggle.querySelector("i");

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('show');

    // Toggle between menu and close icon
    if (sidebar.classList.contains('show')) {
        menuIcon.textContent = "close";  // Material Icons 'close'
    } else {
        menuIcon.textContent = "menu";   // Material Icons 'menu'
    }
});


// Profile Menu Toggle
const profileToggle = document.getElementById('profile-toggle');
const profileMenu = document.getElementById('profile-menu');

profileToggle.addEventListener('click', () => {
    profileMenu.classList.toggle('show');
});

// Close profile menu when clicking outside
document.addEventListener('click', (event) => {
    if (!profileToggle.contains(event.target) && !profileMenu.contains(event.target)) {
        profileMenu.classList.remove('show');
    }
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (event) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
            sidebar.classList.remove('show');
            sidebarToggle.innerHTML = '<i data-lucide="menu"></i>';
            lucide.createIcons();
        }
    }
});