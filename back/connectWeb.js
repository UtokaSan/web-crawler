const url = 'https://localhost:3000/api/produits'; // Remplacez l'URL par celle de votre API backend

fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });