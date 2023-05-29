const puppeteer = require('puppeteer');
require("dotenv").config();


async function LikeFunction (number_input1,number_input2,checked,urlInput,userInput,likeChoice) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Se rendre sur la page de connexion Instagram
    await page.goto('https://www.instagram.com/accounts/login', { waitUntil: "networkidle2" });
    await page.waitForSelector('input[name=username]');
    await page.type('input[name=username]', 'LesfoufoufduQuoartier', { delay: 20 });
    await page.type('input[name=password]', 'PasswordAdmin856726', { delay: 20 });
    await page.click('button[type=submit]', { delay: getRandomDelay() });

    await page.waitForTimeout(8000);
if (likeChoice === "Like"){
    if (checked === "unAcinq"){
      await NewProfilToSearch(userInput);
      const url = await FirstLinkFromProfil(page);
      for (let i = number_input1 - 1; i < number_input2; i++) {
        const link = url[i];
        await page.goto(link, { waitUntil: "networkidle2" });
        await functionlike(page); // Appel de la fonction functionlike pour chaque lien dans la plage spécifiée
      }
    }else if ((checked === "Specific")){
      const urls = urlInput.split(',');
      for (const url of urls) {
        const trimmedUrl = url.trim(); // Supprimer les espaces vides autour de chaque URL
        await page.goto(trimmedUrl, { waitUntil: "networkidle2" });
        await LikePost(page); // Passer chaque URL à la fonction functionlike
      }
    }
  }else if (likeChoice === "UnLike"){
    if (checked === "unAcinq"){
      await NewProfilToSearch(userInput);
      const url = await FirstLinkFromProfil(page);
      for (let i = number_input1 - 1; i < number_input2; i++) {
        const link = url[i];
        await page.goto(link, { waitUntil: "networkidle2" });
        await UnlikePost(page); // Appel de la fonction functionlike pour chaque lien dans la plage spécifiée
      }
    }else if ((checked === "Specific")){
      const urls = urlInput.split(',');
      for (const url of urls) {
        const trimmedUrl = url.trim(); // Supprimer les espaces vides autour de chaque URL
        await page.goto(trimmedUrl, { waitUntil: "networkidle2" });
        await UnlikePost(page); // Passer chaque URL à la fonction functionlike
      }
    }
  }
    await browser.close();
};

//profil = pseudo de la personne
async function NewProfilToSearch(page,profil) {
  await page.goto('https://www.instagram.com/' + profil, { waitUntil: "networkidle2" });
}

async function FirstLinkFromProfil(page) {
  let allHrefs = []; // Tableau pour stocker tous les liens extraits
  for (let i = 0; i < 3; i++) {
    // Utiliser Puppeteer pour extraire les liens href de l'article spécifique
    const hrefs = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('article.x1iyjqo2 a[href]'));
      return links.map(link => link.href);
    });
    // Vérifier si les liens extraits sont les mêmes que les précédents
    const lastLinkDifferent = hrefs[hrefs.length - 1] !== allHrefs[allHrefs.length - 1];
    if (!lastLinkDifferent || hrefs.length === 0) {
      break; // Arrêter la boucle si le dernier lien n'est pas différent ou si aucun lien n'est extrait
    }
    allHrefs = allHrefs.concat(hrefs); // Ajouter les liens extraits au tableau global
    // Faire défiler la page jusqu'en bas
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(4000); // Attendre 4 secondes avant de continuer au prochain cycle
  }
  console.log(allHrefs); // Afficher tous les liens extraits
  return allHrefs;
}

async function LikePost (page){
  //Connaitre la couleur du j'aime , blanc ou rouge
  const svgSelector = 'span.xp7jhwk svg'; // Sélecteur CSS pour le premier élément SVG avec la classe "_aame"
  // Attendre que l'élément SVG soit présent dans le DOM
  await page.waitForSelector(svgSelector);
  // Sélectionner le premier élément SVG avec la classe "_aame"
  const svgHandle = await page.$(svgSelector);
  // Extraire la valeur de l'attribut "color" de l'élément SVG
  const colorValue = await page.evaluate((svg) => {
    const svgElement = svg;
    return svgElement.getAttribute('color');
  }, svgHandle);
  //rgb(255, 48, 64) = rouge
  if (colorValue == "rgb(255, 48, 64)"){
      console.log("Le post " + url + "demandé possède déjà un j'aime")
  }else {
  const buttonSelector = 'span.xp7jhwk button'; // Sélecteur CSS pour le premier bouton dans le span
  // Attendre que le span avec la classe "xp7jhwk" soit présent dans le DOM
  await page.waitForSelector(buttonSelector);
  // Sélectionner le premier bouton dans le span
  const firstButtonHandle = await page.$(buttonSelector);
  // Attendre un court délai avant de cliquer sur le bouton
  await page.waitForTimeout(getRandomDelay());
  // Cliquer sur le premier bouton
  await firstButtonHandle.click();
  }
}

async function UnlikePost (page){
  //Connaitre la couleur du j'aime , blanc ou rouge
  const svgSelector = 'span.xp7jhwk svg'; // Sélecteur CSS pour le premier élément SVG avec la classe "_aame"
  // Attendre que l'élément SVG soit présent dans le DOM
  await page.waitForSelector(svgSelector);
  // Sélectionner le premier élément SVG avec la classe "_aame"
  const svgHandle = await page.$(svgSelector);
  // Extraire la valeur de l'attribut "color" de l'élément SVG
  const colorValue = await page.evaluate((svg) => {
    const svgElement = svg;
    return svgElement.getAttribute('color');
  }, svgHandle);
  //rgb(255, 48, 64) = rouge
  if (colorValue == "rgb(38, 38, 38)"){
      console.log("Le post " + url + "demandé ne possède pas de like !")
  }else {
  const buttonSelector = 'span.xp7jhwk button'; // Sélecteur CSS pour le premier bouton dans le span
  // Attendre que le span avec la classe "xp7jhwk" soit présent dans le DOM
  await page.waitForSelector(buttonSelector);
  // Sélectionner le premier bouton dans le span
  const firstButtonHandle = await page.$(buttonSelector);
  // Attendre un court délai avant de cliquer sur le bouton
  await page.waitForTimeout(getRandomDelay());
  // Cliquer sur le premier bouton
  await firstButtonHandle.click();
  }
}

// Fonction pour obtenir un délai aléatoire
function getRandomDelay() {
    return Math.floor(Math.random() * 500) + 500; // Délai entre 500 et 1000 ms
}

function getRandomDelayComment() {
    return Math.floor(Math.random() * 4000) + 1000; // Délai entre 3000 et 7000 ms (3 et 7 secondes)
}

module.exports = {
  LikeFunction
};