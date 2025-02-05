const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

// Handle panel switching
signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

// Add mobile detection and handling
function isMobile() {
    return window.innerWidth <= 768;
}

// Add mobile-specific elements if needed
function setupMobileView() {
    if (isMobile()) {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (!form.querySelector('.mobile-switch')) {
                const mobileSwitch = document.createElement('div');
                mobileSwitch.className = 'mobile-switch';
                const switchButton = document.createElement('button');
                switchButton.type = 'button';
                switchButton.className = 'ghost';
                switchButton.textContent = form.closest('.sign-in-container') ? 
                    'Switch to Student Login' : 'Switch to Admin Login';
                switchButton.onclick = () => {
                    container.classList.toggle('right-panel-active');
                };
                mobileSwitch.appendChild(switchButton);
                form.appendChild(mobileSwitch);
            }
        });
    }
}

// Handle resize events
window.addEventListener('resize', setupMobileView);

// Initial setup
document.addEventListener('DOMContentLoaded', setupMobileView);