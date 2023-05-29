fetch('http://localhost:3000/api/screenlike')
  .then(response => response.json())
  .then(data => {
    const div = document.querySelector('#screenshotContainer');

    // Parcourir les URLs des images et les ajouter au contenu HTML de la div
    data.imageUrls.forEach(imageUrl => {
      const img = document.createElement('img');
      // Remplacer les "\" et "/" par des "/"
      img.src = 'file:///' + imageUrl.replace(/\\/g, '/').replace(/\/+/g, '/');
      img.classList.add('screenshot');
      div.appendChild(img);
    });
  })
  .catch(error => {
    console.error(error);
  });
