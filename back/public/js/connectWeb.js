fetch("http://localhost:3000/api/produitsamazon")
    .then(response => response.json())
    .then(data => {
        console.log(data)
        const amazonSelect = document.querySelector("#main-amazon")
        const divElement = document.createElement('div');
        divElement.classList.add('item-amazon');
        for (let i = 0; i < 5; i++) {
            const produit = data[i];
            const itemClass = `item-${i + 1}`;
            const divElement = document.createElement('div');
            divElement.classList.add(itemClass);
            divElement.classList.add('item-amazon');
            const paragraph = document.createElement('p');
            paragraph.textContent = produit.titre;
            const priceParagraph = document.createElement('p');
            priceParagraph.textContent = produit.prix;
            const imgElement = document.createElement('img');
            imgElement.src = produit.image;
            divElement.appendChild(paragraph);
            divElement.appendChild(priceParagraph);
            divElement.appendChild(imgElement);
            amazonSelect.appendChild(divElement);
        }
    })
    .catch(error => {
        console.error(error);
    });

fetch("http://localhost:3000/api/produitsaliexpress")
    .then(response => response.json())
    .then(data => {
        console.log(data)
        const aliexpressSelec = document.querySelector("#main-aliexpress")
        const divElement = document.createElement('div');
        divElement.classList.add('item-aliexpress');
        for (let i = 0; i < 5; i++) {
            const produit = data[i];
            const itemClass = `item-${i + 1}`;
            const divElement = document.createElement('div');
            divElement.classList.add(itemClass);
            divElement.classList.add('item-aliexpress');
            const paragraph = document.createElement('p');
            paragraph.textContent = produit.titre;
            const priceParagraph = document.createElement('p');
            priceParagraph.textContent = produit.prix;
            const imgElement = document.createElement('img');
            imgElement.src = produit.image;
            divElement.appendChild(paragraph);
            divElement.appendChild(priceParagraph);
            divElement.appendChild(imgElement);
            aliexpressSelec.appendChild(divElement);
        }
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