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

btn.addEventListener('click', function() {
    const isChecked = checkbox.classList.contains('checked');
    const number1 = parseInt(numberInputs[0].innerText);
    const number2 = parseInt(numberInputs[1].innerText);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/crawler/sale');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log('Requête réussie. Réponse du serveur :', xhr.responseText);
        } else {
            console.error('Erreur lors de la requête. Statut du serveur :', xhr.status);
        }
    };
    xhr.onerror = function() {
        console.error('Erreur lors de la requête.');
    };
    const data = {
        checkbox: isChecked,
        number1: number1,
        number2: number2
    };
    xhr.send(JSON.stringify(data));
});
