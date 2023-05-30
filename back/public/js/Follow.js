fetch('http://localhost:3000/api/screenfollow')
  .then(response => response.json())
  .then(data => {
    const div = document.querySelector('#screenshotContainer');

    data.imageUrls.forEach(imageUrl => {
      const img = document.createElement('img');
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