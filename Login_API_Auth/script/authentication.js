// Helper function to get a cookie (same as in login.js)
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
// Helper function to delete a cookie
function deleteCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/'; // Set expiry to past
}
// Check login status on load
window.onload = function() {    
    const token = getCookie('session_token');
    //const username = getCookie('username');
    if (getCookie('session_token')) {
        //document.getElementById('welcomeMessage').textContent = 'Welcome, ' + username + '['+token+']!!!';
    } else {
        // If no cookie, redirect to login page
        window.location.href = 'index.html';
    }
};
// Logout function
function logout() {
    deleteCookie('session_token');
    //deleteCookie('username');
    window.location.href = 'index.html';
}
function buildUrl(url, parameters) {
    var qs = "";
    for (var key in parameters) {
        var value = parameters[key];
        qs += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
    }
    if (qs.length > 0) {
        qs = qs.substring(0, qs.length - 1); //chop off last "&"
        url = url + "?" + qs;
    }
    return url;
}