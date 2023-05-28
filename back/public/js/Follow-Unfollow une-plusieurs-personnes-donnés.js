const personContainer = document.querySelector('.person-container');
const input = personContainer.querySelector('.input');
const btn = document.querySelector('.btn');

btn.addEventListener('click', function() {
    const usernames = input.value.split(',').map(username => username.trim());

    const selectedOption = document.querySelector('input[name="option"]:checked').value;

    const data = usernames.map(username => ({
        username: username,
        option: selectedOption
    }));

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
    xhr.send(JSON.stringify(data));
});
