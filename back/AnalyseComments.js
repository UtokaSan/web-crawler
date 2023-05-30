const puppeteer = require('puppeteer');
const client = require('./server.js');
require("dotenv").config();

const Sentiment = require('sentiment');

async function AnalyseFunction (client,user) {
    const deleteQuery = `DELETE  FROM comments`;
    await client.query(deleteQuery);
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://www.instagram.com/accounts/login', { waitUntil: "networkidle2" });
    await page.waitForSelector('input[name=username]');
    await page.type('input[name=username]', 'fodaw77731', { delay: getRandomDelay() });
    await page.type('input[name=password]', 'PasswordAdmin856726', { delay: getRandomDelay() });
    await page.click('button[type=submit]', { delay: getRandomDelay() });
    await page.waitForTimeout(8000);
    await page.goto("https://www.instagram.com/" + user, { waitUntil: "networkidle2" });
    const hrefs = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('article.x1iyjqo2 a[href]'));
    return links.map(link => link.href);
  });

  console.log(hrefs);

  for (let i = 0; i < 3; i++) {
    await page.waitForTimeout(3000);
    console.log("tentative sur hrefs :" + hrefs[i]);
    await page.goto(hrefs[i], { waitUntil: "networkidle2" });
    await BugInsta(page,user,hrefs[i]);
    const boutonCommentairesSelector = 'li div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.xdj266r.xat24cr.x1n2onr6.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.xl56j7k button._abl-';
    const clics = 10;
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

async function BugInsta(page,url,post) {
    try {
    try {
        await page.waitForSelector('label.uiButton input[type="button"][name="login"]');
    } catch(error){
        console.log("Pas de popup");
    }
    NewProfilToSearch(page,url);
    await page.waitForSelector('a.x1i10hfl button._acan');
    await page.click('a.x1i10hfl button._acan');
    await page.waitForSelector('input[name=username]');
    await page.type('input[name=username]', 'fodaw77731', { delay: getRandomDelay() });
    await page.type('input[name=password]', 'PasswordAdmin856726', { delay: getRandomDelay() });
    await page.click('button[type=submit]', { delay: getRandomDelay() });
    await page.waitForTimeout(8000);
    await page.goto(post, { waitUntil: "networkidle2" });

}catch (error){

}
}

async function NewProfilToSearch(page,profil) {
    await page.goto('https://www.instagram.com/' + profil, { waitUntil: "networkidle2" });
}

async function updateScore(client,comment, score) {
    const emoticons = await getAllEmoticonsFromDB(client);
  
    for (const emoticon of emoticons) {
      if (comment.includes(emoticon.smiley)) {
        score += emoticon.score;
      }
    }
  
    return score;
}

async function getAllEmoticonsFromDB(client) {
    const query = 'SELECT smiley, score FROM emoticones';
    try {
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des émojis depuis la base de données:', error);
      return [];
    }
}


function getRandomDelay() {
    return Math.floor(Math.random() * 500) + 500;
}

function getRandomDelayComment() {
    return Math.floor(Math.random() * 4000) + 1000;
}

module.exports = {
    AnalyseFunction
};