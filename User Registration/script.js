document.addEventListener('DOMContentLoaded', function () {
    const form            = document.getElementById('registrationForm');
    const submitBtn       = document.getElementById('submitBtn');
    const warningMessage  = document.getElementById('warningMessage');
    const successMessage  = document.getElementById('successMessage');
    const serverMessage   = document.getElementById('serverMessage');

    const usernameInput        = document.getElementById('username');
    const emailInput           = document.getElementById('email');
    const passwordInput        = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // ── Helpers ────────────────────────────────────────────────────────────────

    function setValid(input) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        const err = input.nextElementSibling;
        if (err && err.classList.contains('error-message')) {
            err.classList.remove('visible');
        }
    }

    function setInvalid(input, message) {
        input.classList.remove('valid');
        input.classList.add('invalid');
        const err = input.nextElementSibling;
        if (err && err.classList.contains('error-message')) {
            err.textContent = message;
            err.classList.add('visible');
        }
    }

    function clearState(input) {
        input.classList.remove('valid', 'invalid');
        const err = input.nextElementSibling;
        if (err && err.classList.contains('error-message')) {
            err.classList.remove('visible');
        }
    }

    function hideMessages() {
        warningMessage.classList.remove('visible');
        successMessage.classList.remove('visible');
        serverMessage.classList.remove('visible');
    }

    // ── Field validators ───────────────────────────────────────────────────────

    function validateUsername() {
        const value = usernameInput.value.trim();
        if (value === '') {
            setInvalid(usernameInput, 'Username is required');
            return false;
        }
        if (value.length < 3) {
            setInvalid(usernameInput, 'Username must be at least 3 characters');
            return false;
        }
        setValid(usernameInput);
        return true;
    }

    function validateEmail() {
        const value = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value === '') {
            setInvalid(emailInput, 'Email is required');
            return false;
        }
        if (!emailRegex.test(value)) {
            setInvalid(emailInput, 'Please enter a valid email address');
            return false;
        }
        setValid(emailInput);
        return true;
    }

    function validatePassword() {
        const value = passwordInput.value;
        if (value === '') {
            setInvalid(passwordInput, 'Password is required');
            return false;
        }
        if (value.length < 6) {
            setInvalid(passwordInput, 'Password must be at least 6 characters');
            return false;
        }
        setValid(passwordInput);
        return true;
    }

    function validateConfirmPassword() {
        const value = confirmPasswordInput.value;
        if (value === '') {
            setInvalid(confirmPasswordInput, 'Please confirm your password');
            return false;
        }
        if (value !== passwordInput.value) {
            setInvalid(confirmPasswordInput, 'Passwords do not match');
            return false;
        }
        setValid(confirmPasswordInput);
        return true;
    }

    function validateAll() {
        const u = validateUsername();
        const e = validateEmail();
        const p = validatePassword();
        const c = validateConfirmPassword();
        return u && e && p && c;
    }

    // ── Real-time input listeners ──────────────────────────────────────────────

    usernameInput.addEventListener('input',        () => { hideMessages(); validateUsername(); });
    emailInput.addEventListener('input',           () => { hideMessages(); validateEmail(); });
    passwordInput.addEventListener('input',        () => { hideMessages(); validatePassword(); });
    confirmPasswordInput.addEventListener('input', () => { hideMessages(); validateConfirmPassword(); });

    [usernameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
        input.addEventListener('focus', () => {
            clearState(input);
            hideMessages();
        });
    });

    // ── Form submission ────────────────────────────────────────────────────────

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        hideMessages();

        if (!validateAll()) {
            warningMessage.classList.add('visible');
            return;
        }

        // Disable button while request is in-flight
        submitBtn.disabled = true;
        submitBtn.textContent = 'Registering…';

        const payload = {
            username: usernameInput.value.trim(),
            email:    emailInput.value.trim(),
            password: passwordInput.value
        };

        fetch('register.php', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload)
        })
        .then(function (response) {
            return response.json().then(function (data) {
                return { ok: response.ok, data: data };
            });
        })
        .then(function (result) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Register';

            if (result.ok && result.data.success) {
                successMessage.classList.add('visible');
                form.reset();
                [usernameInput, emailInput, passwordInput, confirmPasswordInput].forEach(clearState);
                usernameInput.focus();
            } else {
                serverMessage.textContent = result.data.message || 'Registration failed. Please try again.';
                serverMessage.classList.add('visible');
            }
        })
        .catch(function () {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Register';
            serverMessage.textContent = 'Could not reach the server. Please try again later.';
            serverMessage.classList.add('visible');
        });
    });
});
