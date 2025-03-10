// Check for the JWT token in localStorage and verify its validity  
function checkToken() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        // No token found, redirect to login
        window.location.href = '/PAGES/loginpage.html';
        return;
    }

    // Parse the token and check if it's expired
    const decodedToken = parseJwt(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp < currentTime) {
        // Token expired, redirect to login
        alert('Session expired. Please log in again.');
        localStorage.removeItem('authToken');
        window.location.href = '/PAGES/loginpage.html';
    }
}

// Helper function to decode JWT
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Call checkToken on page load
window.onload = checkToken;