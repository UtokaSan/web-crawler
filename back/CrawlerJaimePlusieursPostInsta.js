const puppeteer = require('puppeteer');
require("dotenv").config();


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

    //profil = pseudo de la personne
    async function NewProfilToSearch(page,profil) {
      const linkSelector = 'a.x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz._a6hd';
      await page.waitForSelector(linkSelector);
      const thirdLinkHandle = await page.evaluateHandle((selector) => {
           const links = document.querySelectorAll(selector);
          return links[2]; // Index 2 correspond au troisième élément
      }, linkSelector);
      await thirdLinkHandle.click();
      const inputSelector = 'input._aauy';
      await page.waitForSelector(inputSelector);
      await typeWithRandomDelay(page, inputSelector, profil);
      async function typeWithRandomDelay(page, selector, text) {
          for (let i = 0; i < text.length; i++) {
              const char = text[i];
              await page.type(selector, char, { delay: getRandomDelay() });
          }
      }
      const divSelector = 'div.x9f619.x78zum5.xdt5ytf.x6ikm8r.x1odjw0f.x4uap5.x18d9i69.xkhd6sd.xh8yej3.x5yr21d.xocp1fn:first-child';
      const profileLinkSelector = `${divSelector} a.x1i10hfl`;
      await page.waitForTimeout(4000);
      await page.waitForSelector(divSelector);
      // Cliquer sur le premier profil
      await page.click(profileLinkSelector);
      await page.waitForTimeout(5000);
    }


  async function FirstLinkFromProfil(page,profil) {
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


