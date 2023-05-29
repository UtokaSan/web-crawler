fetch('http://localhost:3000/api/screenfollow')
  .then(response => response.json())
  .then(data => {
    const div = document.querySelector('#screenshotContainer');

    // Parcourir les URLs des images et les ajouter au contenu HTML de la div
    data.imageUrls.forEach(imageUrl => {
      const img = document.createElement('img');
      // Transform the URL
      imageUrl = imageUrl.replace(/\\/g, '/').replace(/\/+/g, '/');
      const transformedUrl = imageUrl.replace(/^.*\/screenshots/, 'http://localhost:3000/screenshots');
      img.src = transformedUrl;
      img.classList.add('screenshot');
      div.appendChild(img);
    });
  })
  .catch(error => {
    console.error(error);
  });