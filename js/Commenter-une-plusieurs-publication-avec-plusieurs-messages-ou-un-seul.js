const usersInput = document.querySelector('.input:nth-of-type(1)');
const messageInput = document.querySelector('.input:nth-of-type(2)');
const btn = document.querySelector('.btn');

const userMessages = {};

btn.addEventListener('click', function() {
    const users = usersInput.value.trim().split(',');
    const message = messageInput.value.trim();

    if (users.length === 0 || message === '') {
        console.log('Veuillez remplir tous les champs.');
        return;
    }

    for (let i = 0; i < users.length; i++) {
        const user = users[i].trim();
        if (user !== '') {
            userMessages[user] = message;
        }
    }

    usersInput.value = '';
    messageInput.value = '';

    const data = {
        userMessages: userMessages
    };

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