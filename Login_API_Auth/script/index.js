// Helper function to set a cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Helper function to get a cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Function to handle login form submission
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('psw');

    let username = usernameInput.value;
    let password = passwordInput.value;

    checkLogin(username, password);
});

// Check if already logged in when the page loads
window.onload = function () {
    if (getCookie('session_token')) {
        window.location.href = 'dashboard.html';
    }
};

const STATIC_CREDENTIALS = [
    { username: 'admin', password: '12345' },
    { username: 'student', password: 'student123' }
];

function checkLogin(username, password) {
    const validUser = STATIC_CREDENTIALS.find((account) => {
        return account.username === username.trim() && account.password === password;
    });

    if (validUser) {
        const encodedCredentials = btoa(`${validUser.username}:${validUser.password}`);
        document.getElementById("messageArea").textContent = "Login successful!";
        document.getElementById("messageArea").style.color = 'green';

        // Set a "session" cookie that lasts for 1 day
        setCookie('session_token', encodedCredentials, 1);

        // Redirect to a protected page
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById("messageArea").textContent = "Warning! invalid user and password.";
        document.getElementById("messageArea").style.color = '#f8f9fa';
    }
}
