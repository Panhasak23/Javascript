function showAlert(msg) {
    alert("Information: " + msg);
}

function addition(a, b) {
    return a + b;
}

function inputGrade() {
    let grade = prompt("Enter grade:");
    return parseFloat(grade);
}

function passOrFail(score) {
    let result = 'Fail';
    if (score >= 60) {
        result = 'Pass';
    }
    return result;
}

function updateSum() {
    let g1 = parseFloat(document.getElementById('grade1').value);
    let g2 = parseFloat(document.getElementById('grade2').value);
    let sum;
    if (isNaN(g1) || isNaN(g2)) {
        sum = 'N/A';
    } else {
        sum = addition(g1, g2);
    }
    document.getElementById('sumResult').innerHTML = 'Sum: ' + sum;
}

function updatePassFail() {
    let scoreVal = document.getElementById('score').value;
    let result;
    if (!scoreVal || isNaN(parseFloat(scoreVal))) {
        result = 'N/A';
    } else {
        result = passOrFail(parseFloat(scoreVal));
    }
    document.getElementById('passFailResult').innerHTML = 'Result: ' + result;
}

function showAlert2() {
    document.getElementById('alertMessage').innerHTML = "Yes,Yes,Yes";
    document.getElementById('alertMessage').style.display = 'block';
}

