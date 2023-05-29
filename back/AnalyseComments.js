const puppeteer = require('puppeteer');
const client = require('./server.js');
require("dotenv").config();

const Sentiment = require('sentiment');

async function AnalyseFunction (client,user) {
    const deleteQuery = `DELETE  FROM comments`;
    await client.query(deleteQuery);
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Se rendre sur la page de connexion Instagram
    await page.goto('https://www.instagram.com/accounts/login', { waitUntil: "networkidle2" });
    await page.waitForSelector('input[name=username]');
    await page.type('input[name=username]', 'UnFouNeVauxPasDeuxFOU', { delay: 20 });
    await page.type('input[name=password]', 'PasswordAdmin856726', { delay: 20 });
    await page.click('button[type=submit]', { delay: getRandomDelay() });

    await page.waitForTimeout(8000);

    // Attendre que la page de destination soit complètement chargée
    await page.goto("https://www.instagram.com/" + user, { waitUntil: "networkidle2" });

      // Utiliser Puppeteer pour extraire les liens href de l'article spécifique
  const hrefs = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('article.x1iyjqo2 a[href]'));
    return links.map(link => link.href);
  });

  console.log(hrefs);

  for (let i = 0; i < 3; i++) {
    await page.waitForTimeout(3000);
    console.log("tentative sur hrefs :" + hrefs[i]);
    // Attendre que la page de destination soit complètement chargée
    await page.goto(hrefs[i], { waitUntil: "networkidle2" });

    try {
        await page.waitForSelector('label.uiButton input[type="button"][name="login"]');
        await page.goto(url, { waitUntil: "networkidle2" });
        // Attendre que le bouton de connexion soit présent dans la page et soit cliquable
        await page.waitForSelector('a.x1i10hfl button._acan');
        // Cliquer sur le bouton de connexion
        await page.click('a.x1i10hfl button._acan');
        await page.waitForSelector('input[name=username]');
        await page.type('input[name=username]', 'UnFouNeVauxPasDeuxFOU', { delay: 20 });
        await page.type('input[name=password]', 'PasswordAdmin856726', { delay: 20 });
        await page.click('button[type=submit]', { delay: getRandomDelay() });
    
        await page.waitForTimeout(8000);
        await page.goto(hrefs[i], { waitUntil: "networkidle2" });

    }catch (error){

    }

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

    commentaires.forEach(async comment => {
        try {
            const result =  sentiment.analyze(comment);
            result.score = await updateScore(client,comment,result.score);
            insertDB(client,comment,result.score);
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
    await browser.close();
};

async function insertDB(client, comm, score) {
    let insertQuery;
    insertQuery = `
        INSERT INTO comments (commentaires, score)
        VALUES ($1, $2) RETURNING Id
    `;
    try {
        const res = await client.query(insertQuery, [comm, score]);
        console.log('Nouvelle ligne insérée avec succès.');
    } catch (err) {
        console.error('Erreur lors de l\'insertion d\'une nouvelle ligne:', err.message);
    }
}

  
async function updateScore(client,comment, score) {
    const emoticons = await getAllEmoticonsFromDB(client); // Fonction pour récupérer tous les émojis depuis la base de données
  
    for (const emoticon of emoticons) {
      if (comment.includes(emoticon.smiley)) {
        console.log("Score changé-------------------------------------------------")
        score += emoticon.score;
      }
    }
  
    return score;
}

async function getAllEmoticonsFromDB(client) {
    const query = 'SELECT smiley, score FROM emoticones';
    try {
      const result = await client.query(query);
      return result.rows; // Renvoyer les lignes résultantes (émojis et scores)
    } catch (error) {
      console.error('Erreur lors de la récupération des émojis depuis la base de données:', error);
      return []; // En cas d'erreur, renvoyer un tableau vide
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
    AnalyseFunction
};