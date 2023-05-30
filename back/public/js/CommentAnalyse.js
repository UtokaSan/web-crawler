fetch("http://localhost:3000/api/analyse")
    .then(response => response.json())
    .then(data => {
        const div = document.querySelector("#test");
        const moyenneDiv = document.querySelector("#moyenne");

        let html = "";

        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            html += `<p>Commentaire ${i + 1}: ${data[i].commentaires} -> Score : ${data[i].score}</p>`;
            sum += data[i].score;
        }

        const average = sum / data.length;
        moyenneDiv.innerHTML = `<h1>Moyenne des scores: ${average.toFixed(2)}<h1>`;

        div.innerHTML = html;
    })
    .catch(error => {
        console.error(error);
    });
