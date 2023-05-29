fetch("http://localhost:3000/api/profil")
    .then(response => response.json())
    .then(data => {
        const div = document.querySelector("#test");

        // Créer une chaîne HTML avec les données du profil
        let html = "";
        html += `<img src="${"http://localhost:3000/screenshots/"+ data[0].image}"  width="300" height="300">`;
        html += `<p>Pseudo : ${data[0].pseudo}</p>`;
        html += `<p>Publication : ${data[0].publication}</p>`;
        html += `<p>Followers : ${data[0].followers}</p>`;
        html += `<p>Suivie : ${data[0].suivie}</p>`;
        html += `<p>Description : ${data[0].description}</p>`;
        html += `<p>Contact : ${data[0].contact}</p>`;

        div.innerHTML = html;
    })
    .catch(error => {
        console.error(error);
    });

    fetch("http://localhost:3000/api/profildetail")
    .then(response => response.json())
    .then(data => {
        const div = document.querySelector("#test2");

        // Créer une chaîne HTML avec les données du profil
        let html = "";
        for (let i = 0; i < data.length; i++) {
            html += `<img src="${"http://localhost:3000/screenshots/"+ data[i].image}"  width="300" height="300">`;
            html += `<p>texte ${i + 1}: ${data[i].text}</p>`;
        }

        div.innerHTML = html;
    })
    .catch(error => {
        console.error(error);
    });
