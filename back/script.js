const puppeteer = require('puppeteer');
require("dotenv").config();

const url = "https://www.instagram.com/danae";
const Sentiment = require('sentiment');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Se rendre sur la page de connexion Instagram
    await page.goto('https://www.instagram.com/accounts/login', { waitUntil: "networkidle2" });
    await page.waitForSelector('input[name=username]');
    await page.type('input[name=username]', 'Pyrnoojvet', { delay: getRandomDelay() });
    await page.type('input[name=password]', 'PasswordAdmin856726', { delay: getRandomDelay() });
    await page.click('button[type=submit]', { delay: getRandomDelay() });

    await page.waitForTimeout(8000);

    // Attendre que la page de destination soit complètement chargée
    await page.goto(url, { waitUntil: "networkidle2" });

      // Utiliser Puppeteer pour extraire les liens href de l'article spécifique
  const hrefs = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('article.x1iyjqo2 a[href]'));
    return links.map(link => link.href);
  });

  console.log(hrefs);

  for (let i = 0; i < hrefs.length; i++) {
    console.log("tentative sur hrefs :" + hrefs[i]);
    // Attendre que la page de destination soit complètement chargée
    await page.goto(hrefs[i], { waitUntil: "networkidle2" });

    // Cliquer pour afficher les commentaires plusieurs fois
    const boutonCommentairesSelector = 'li div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.xdj266r.xat24cr.x1n2onr6.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.xl56j7k button._abl-';
    const clics = 10;

    // Scraper tous les commentaires
    try {
        for (let i = 0; i < clics; i++) {
            console.log('------Actualisation commentaire x ' + i + '-----');
            await page.waitForSelector(boutonCommentairesSelector, { timeout: 10000 });
            await page.click(boutonCommentairesSelector, { delay: getRandomDelayComment() });
            await page.waitForTimeout(getRandomDelayComment()); // Attendre un délai aléatoire entre les clics
        }
    } catch (error) {
        console.error('Une erreur s\'est produite lors de l\'attente du sélecteur :', error);
        console.log('J\'ai rencontré une erreur mais je continue.');
    }

    const sentiment = new Sentiment();

    const commentaires = await page.$$eval('div._a9zs > span', elements => elements.map(el => el.textContent.trim()));

    commentaires.forEach(comment => {
        try {
            const result = sentiment.analyze(comment);
            console.log(`Comment: ${comment}`);
            console.log(`Sentiment Score: ${result.score}`);
            console.log(`Sentiment Comparative: ${result.comparative}`);
            console.log(`Sentiment Tokens: ${JSON.stringify(result.tokens)}`);
            console.log('-------------------');
        } catch (error) {
            console.error('Une erreur s\'est produite lors de l\'analyse du commentaire :', error);
        }
    });
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
