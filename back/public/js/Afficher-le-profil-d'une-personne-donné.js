const input = document.querySelector('.input');
const btn = document.querySelector('.btn');

function handleFormSubmit(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    const usernameInput = document.getElementById('usernameInput');
    const username = usernameInput.value.trim();

    if (username === '') {
        console.log('Veuillez entrer un nom d\'utilisateur.');
        return;
    }

    const data = {
        username: username
    };

    // Utilisation d'une requête AJAX pour envoyer les données au serveur
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
}

