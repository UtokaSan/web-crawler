fetch("http://localhost:3000/api/produitsamazon")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const div = document.querySelector("#test");
        div.innerHTML = data[0].titre;
    })
    .catch(error => {
        console.error(error);
    });

fetch ("http://localhost:3000/crawler/sale")
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });