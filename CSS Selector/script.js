const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
let colorIndex = 0;

function changeColor() {
    const element = document.getElementById('text');
    element.style.color = colors[colorIndex];
    colorIndex = (colorIndex + 1) % colors.length;
}
