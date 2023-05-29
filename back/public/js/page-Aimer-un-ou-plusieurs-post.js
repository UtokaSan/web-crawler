const checkbox = document.querySelector('.checkbox');
const numberInputs = document.querySelectorAll('.number-input');
const arrowLeft = document.querySelector('.arrow:first-child');
const arrowRight = document.querySelector('.arrow:last-child');
const btn = document.querySelector('.btn');

checkbox.addEventListener('click', function() {
    checkbox.classList.toggle('checked');
});

arrowLeft.addEventListener('click', function() {
    const currentValue = parseInt(numberInputs[0].innerText);
    if (currentValue > 1) {
        numberInputs[0].innerText = currentValue - 1;
    }
});

arrowRight.addEventListener('click', function() {
    const currentValue = parseInt(numberInputs[1].innerText);
    if (currentValue < 50) {
        numberInputs[1].innerText = currentValue + 1;
    }
});
