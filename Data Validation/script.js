document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('teacherForm');
    const warningMessage = document.getElementById('warningMessage');
    const successMessage = document.getElementById('successMessage');
    const inputs = form.querySelectorAll('input');
    const errorMessages = form.querySelectorAll('.error-message');
    const firstInput = document.getElementById('teacherCode'); // First input field
    
    // Reset all error states
    function resetErrors() {
        inputs.forEach(input => {
            input.classList.remove('invalid', 'valid');
        });
        
        errorMessages.forEach(message => {
            message.classList.remove('visible');
        });
        
        warningMessage.classList.remove('visible');
        successMessage.classList.remove('visible');
    }
    
    // Hide success message
    function hideSuccessMessage() {
        successMessage.classList.remove('visible');
    }
    
    // Validate Teacher Code (non-empty)
    function validateTeacherCode(input) {
        const value = input.value.trim();
        const errorMessage = input.nextElementSibling;
        
        if (value === '') {
            input.classList.remove('valid');
            input.classList.add('invalid');
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.textContent = 'Information is required';
                errorMessage.classList.add('visible');
            }
            return false;
        } else {
            input.classList.remove('invalid');
            input.classList.add('valid');
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.classList.remove('visible');
            }
            return true;
        }
    }
    
    // Validate Full Name (no numbers allowed, only letters and spaces)
    function validateFullName(input) {
        const value = input.value.trim();
        const errorMessage = input.nextElementSibling;
        const hasNumbers = /\d/.test(value);
        const hasLetters = /[a-zA-Z]/.test(value);
        
        if (value === '') {
            input.classList.remove('valid');
            input.classList.add('invalid');
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.textContent = 'Information is required';
                errorMessage.classList.add('visible');
            }
            return false;
        } else if (hasNumbers) {
            input.classList.remove('valid');
            input.classList.add('invalid');
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.textContent = 'Name cannot contain numbers';
                errorMessage.classList.add('visible');
            }
            return false;
        } else if (!hasLetters) {
            input.classList.remove('valid');
            input.classList.add('invalid');
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.textContent = 'Name must contain letters';
                errorMessage.classList.add('visible');
            }
            return false;
        } else {
            input.classList.remove('invalid');
            input.classList.add('valid');
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.classList.remove('visible');
            }
            return true;
        }
    }
    
    // Validate Contact (only numbers, no letters allowed)
    function validateContact(input) {
        const value = input.value.trim();
        const errorMessage = input.nextElementSibling;
        const hasLetters = /[a-zA-Z]/.test(value);
        const isNumeric = /^\d+$/.test(value.replace(/[\s\-\.\(\)]/g, ''));
        
        if (value === '') {
            input.classList.remove('valid');
            input.classList.add('invalid');
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.textContent = 'Information is required';
                errorMessage.classList.add('visible');
            }
            return false;
        } else if (hasLetters) {
            input.classList.remove('valid');
            input.classList.add('invalid');
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.textContent = 'Contact must contain only numbers';
                errorMessage.classList.add('visible');
            }
            return false;
        } else if (!isNumeric) {
            input.classList.remove('valid');
            input.classList.add('invalid');
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.textContent = 'Contact must be numeric';
                errorMessage.classList.add('visible');
            }
            return false;
        } else {
            input.classList.remove('invalid');
            input.classList.add('valid');
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.classList.remove('visible');
            }
            return true;
        }
    }
    
    // Validate individual input
    function validateInput(input) {
        const id = input.id;
        
        switch(id) {
            case 'teacherCode':
                return validateTeacherCode(input);
            case 'fullName':
                return validateFullName(input);
            case 'contact':
                return validateContact(input);
            default:
                return true;
        }
    }
    
    // Validate all inputs
    function validateForm() {
        resetErrors();
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            warningMessage.classList.add('visible');
        }
        
        return isValid;
    }
    
    // Form submission handler
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const isValid = validateForm();
        
        if (isValid) {
            // Form submission logic would go here
            console.log('Form submitted successfully');
            
            // Show success message
            successMessage.classList.add('visible');
            
            // Clear the form and reset errors after a short delay
            setTimeout(() => {
                form.reset();
                resetErrors();
                
                // Set focus to the first input field for next record
                firstInput.focus();
            }, 1000);
        }
    });
    
    // Input change handlers
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
            hideSuccessMessage();
        });
        
        input.addEventListener('focus', function() {
            this.classList.remove('invalid', 'valid');
            const errorMessage = this.nextElementSibling;
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.classList.remove('visible');
            }
            hideSuccessMessage();
        });
    });
});