const puppeteer = require('puppeteer');
require("dotenv").config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');


async function DisplayFunction(profil,client) {
    const deleteQuery = `DELETE  FROM profil`;
    await client.query(deleteQuery);
    const delete2Query = `DELETE  FROM profildetail`;
    client.query(delete2Query);

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Se rendre sur la page de connexion Instagram
    await page.goto('https://www.instagram.com/accounts/login', { waitUntil: "networkidle2" });
    await page.waitForSelector('input[name=username]');
    await page.type('input[name=username]', 'fodaw77731', { delay: 20 });
    await page.type('input[name=password]', 'PasswordAdmin856726', { delay: 20 });
    await page.click('button[type=submit]', { delay: getRandomDelay() });

    await page.waitForTimeout(8000);

    await NewProfilToSearch(page,profil);
    await page.waitForTimeout(5000)
    await DisplayProfil(client,page);
    await page.waitForTimeout(5000)
    await browser.close();
};

async function NewProfilToSearch(page,profil) {
    await page.goto('https://www.instagram.com/' + profil, { waitUntil: "networkidle2" });
}

async function DisplayProfil (client,page){
    console.log("Tu passse avant moi ")
    //Image
    const imageDiv = await page.waitForSelector('div._aarf');
    var imageSrc = await page.evaluate((element) => element.querySelector('img').getAttribute('src'), imageDiv);
    imageSrc = await downloadImage(imageSrc);
    console.log(imageSrc);
    //Pseudo
    const h2Element = await page.waitForSelector('h2.x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.x1ms8i2q.xo1l8bm.x5n08af.x10wh9bi.x1wdrske.x8viiok.x18hxmgj');
    const h2Text = await page.evaluate((element) => element.textContent, h2Element);
    console.log(h2Text);
    //Publication
    const liElement = await page.waitForSelector('li.xl565be.x1m39q7l.x1uw6ca5.x2pgyrj');
    const liText = await page.evaluate((element) => element.textContent.trim(), liElement);
    console.log(liText);
    //Followers
    const followersLinkElement = await page.waitForSelector('a[href*="/followers/"]');
    const followersTitle = await page.evaluate((element) => element.querySelector('span._ac2a').getAttribute('title'), followersLinkElement);
    console.log(followersTitle + " Followers");
    //Suivie
    const followingElements = await page.$$('li.xl565be.x1m39q7l.x1uw6ca5.x2pgyrj');
    var followingText = "";
    if (followingElements.length >= 3) {
    followingText = await page.evaluate((element) => element.textContent.trim(), followingElements[2]);
    console.log(followingText);
    }
    //Description
    const divElement = await page.waitForSelector('div._aa_c');
    const nameElement = await page.evaluate((element) => element.querySelector('div.x9f619 > span').textContent.trim(), divElement);
    const contactElement = await page.evaluate((element) => element.querySelector('h1').textContent.trim(), divElement);
    console.log(nameElement);
    console.log(contactElement);
    insertDB(client,imageSrc,h2Text,liText,followersTitle,followingText,nameElement,contactElement);
    //Image-Texte
    // Boucle pour cliquer sur le bouton "Suivant" et récupérer les nouveaux éléments <li>
    while (true) {
        
        try {
        const buttonNext = await page.waitForSelector('button._a9_u._afxw._al46._al47');
        // Cliquer sur le bouton "Suivant"
        await buttonNext.click();
        } catch (error){
            break;
        }
        // Attendre que les nouveaux éléments <li> soient chargés
        await page.waitForTimeout(2000); // Attendre pendant 2 secondes (ajustez si nécessaire)
        // Sélectionner tous les éléments <li> qui n'ont pas encore été traités
        const liElements = await page.$$('ul._acay li._acaz:not(._processed)');
        // Parcourir tous les nouveaux éléments <li>
        for (const liElement of liElements) {
          // Récupérer l'URL de l'image à l'aide de page.evaluate
          var imageSrcTexte = await page.evaluate((element) => element.querySelector('img').getAttribute('src'), liElement);
          // Récupérer le texte à partir de l'élément <span> à l'aide de page.evaluate
          const text = await page.evaluate((element) => element.querySelector('span.x1lliihq').textContent.trim(), liElement);
          // Afficher les informations dans la console (ou effectuer toute autre opération souhaitée)
          imageSrcTexte = await downloadImage(imageSrcTexte);
          insertDB2(client, imageSrcTexte,text);
          console.log(imageSrcTexte);
          console.log(text);
          // Marquer l'élément <li> comme traité en ajoutant une classe CSS
          await liElement.evaluate((element) => element.classList.add('_processed'));
        }
      }
      await page.waitForTimeout(5000)
    }


async function insertDB(client, imageSrc,h2Text,liText,followersTitle,followingText,nameElement,contactElement) {
    let insertQuery;
    insertQuery = `
        INSERT INTO profil (image,pseudo,publication,followers,suivie,description,contact)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING Id
    `;
    try {
        const res = await client.query(insertQuery, [imageSrc,h2Text,liText,followersTitle,followingText,nameElement,contactElement]);
        console.log('Nouvelle ligne insérée avec succès.');
    } catch (err) {
        console.error('Erreur lors de l\'insertion d\'une nouvelle ligne:', err.message);
    }
}

async function insertDB2(client, imageSrcTexte,text) {
    let insertQuery;
    insertQuery = `
        INSERT INTO profildetail (image,text)
        VALUES ($1, $2) RETURNING Id
    `;
    try {
        const res = await client.query(insertQuery, [imageSrcTexte,text]);
        console.log('Nouvelle ligne insérée avec succès.');
    } catch (err) {
        console.error('Erreur lors de l\'insertion d\'une nouvelle ligne:', err.message);
    }
}

  async function downloadImage (imageUrl) {
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageFileName = generateUniqueFileName();
      const folderPath = path.join(__dirname, '../back/public/screenshots');
      // Créer le dossier screenshots si nécessaire
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      const imageFilePath = path.join(__dirname, '../back/public/screenshots', imageFileName);
      fs.writeFileSync(imageFilePath, response.data);
      return imageFileName;
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image :', error);
      throw error;
    }
  };
  
  const generateUniqueFileName = () => {
    const timestamp = Date.now();
    return `image_${timestamp}.jpg`;
  };

// Fonction pour obtenir un délai aléatoire
function getRandomDelay() {
    return Math.floor(Math.random() * 500) + 500; // Délai entre 500 et 1000 ms
}

function getRandomDelayComment() {
    return Math.floor(Math.random() * 4000) + 1000; // Délai entre 3000 et 7000 ms (3 et 7 secondes)
}

module.exports = {
    DisplayFunction
};