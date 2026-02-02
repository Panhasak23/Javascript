// ===== VALIDATION FUNCTIONS =====

/**
 * checkNumber - Validates if a value is a number
 * @param {*} value - The value to check
 * @returns {boolean} - True if value is a number, false otherwise
 */
function checkNumber(value) {
    return !isNaN(value) && value !== '' && value !== null;
}

/**
 * checkPositiveNumber - Validates if a value is a positive number
 * @param {*} value - The value to check
 * @returns {boolean} - True if value is a positive number, false otherwise
 */
function checkPositiveNumber(value) {
    return checkNumber(value) && Number(value) > 0;
}

/**
 * checkDecimal - Validates if a value is a decimal number (contains decimal point)
 * @param {*} value - The value to check
 * @returns {boolean} - True if value is a decimal number, false otherwise
 */
function checkDecimal(value) {
    return checkNumber(value) && String(value).includes('.');
}

/**
 * checkPositiveDecimal - Validates if a value is a positive decimal number
 * @param {*} value - The value to check
 * @returns {boolean} - True if value is a positive decimal number, false otherwise
 */
function checkPositiveDecimal(value) {
    return checkDecimal(value) && Number(value) > 0;
}

/**
 * checkEmail - Validates if a value is a valid email format
 * @param {*} email - The email to check
 * @returns {boolean} - True if email is valid, false otherwise
 */
function checkEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * checkBoolen - Validates if a value is a boolean
 * @param {*} value - The value to check
 * @returns {boolean} - True if value is a boolean, false otherwise
 */
function checkBoolen(value) {
    return typeof value === 'boolean';
}

// ===== COMMISSION CALCULATION FUNCTION =====

/**
 * calculateCommissionRate - Calculates commission percentage based on sale amount
 * @param {number} sale - The sale amount
 * @returns {number} - The commission percentage (0-10)
 */
function calculateCommissionRate(sale) {
    if (sale >= 6000000) {
        return 10;
    } else if (sale >= 3000000) {
        return 5;
    } else if (sale >= 1500000) {
        return 3;
    } else {
        return 1;
    }
}

/**
 * calculateCommission - Calculates the commission amount based on sale
 * @param {number} sale - The sale amount
 * @returns {number} - The commission amount
 */
function calculateCommission(sale) {
    const rate = calculateCommissionRate(sale);
    return (sale * rate) / 100;
}

// ===== UI FUNCTION =====

/**
 * calculateCommission - Handles the commission calculation from form input
 */
function calculateCommission() {
    // Get form values
    const saleInput = document.getElementById('sale').value;
    const emailInput = document.getElementById('email').value;
    const useDecimal = document.getElementById('useDecimal').value === 'true';

    // Clear previous results
    document.getElementById('error').style.display = 'none';
    document.getElementById('result').style.display = 'none';

    // Validate sale input
    if (!saleInput) {
        showError('Please enter a sale amount');
        return;
    }

    if (!checkPositiveNumber(saleInput)) {

    // Calculate commission
    const rate = calculateCommissionRate(sale);
    const commission = (sale * rate) / 100;

    // Format output based on decimal preference
    const saleFormatted = useDecimal ? sale.toFixed(2) : Math.floor(sale);
    const commissionFormatted = useDecimal ? commission.toFixed(2) : Math.floor(commission);

    // Display result
    document.getElementById('resultSale').textContent = saleFormatted;
    document.getElementById('resultRate').textContent = rate + '%';
    document.getElementById('result').style.display = 'block';
}

/**
 * showError - Displays an error message
 * @param {string} message - The error message to display
 */const sale = Number(saleInput);

    const rate = calculateCommissionRate(sale);
    const commission = (sale * rate) / 100;

    const saleFormatted = useDecimal ? sale.toFixed(2) : Math.floor(sale);
    const commissionFormatted = useDecimal ? commission.toFixed(2) : Math.floor(commission);
er(123));              // true
console.log(checkNumber('abc'));            // false

console.log(checkPositiveNumber(100));      // true
console.log(checkPositiveNumber(-50));      // false

console.log(checkDecimal(12.5));            // true
console.log(checkDecimal(12));              // false

console.log(checkPositiveDecimal(12.5));    // true
console.log(checkPositiveDecimal(-12.5));   // false
console.log(checkBoolen(true));             // true
c