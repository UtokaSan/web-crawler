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
}

