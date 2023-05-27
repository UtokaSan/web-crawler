const puppeteer = require('puppeteer');
require("dotenv").config();

const url = "https://www.instagram.com/p/Csl3J6SoTSk/";

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Se rendre sur la page de connexion Instagram
    await page.goto('https://www.instagram.com/accounts/login', { waitUntil: "networkidle2" });
    await page.waitForSelector('input[name=username]');
    await page.type('input[name=username]', 'lesfoufouduqueartier', { delay: getRandomDelay() });
    await page.type('input[name=password]', 'PasswordAdmin856726', { delay: getRandomDelay() });
    await page.click('button[type=submit]', { delay: getRandomDelay() });

    await page.waitForTimeout(8000);

    // Attendre que la page de destination soit complètement chargée
    await page.goto(url, { waitUntil: "networkidle2" });
      
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

    // Fermer le navigateur
    //await browser.close();
})();

// Fonction pour obtenir un délai aléatoire
function getRandomDelay() {
    return Math.floor(Math.random() * 500) + 500; // Délai entre 500 et 1000 ms
}

function getRandomDelayComment() {
    return Math.floor(Math.random() * 4000) + 1000; // Délai entre 3000 et 7000 ms (3 et 7 secondes)
}
