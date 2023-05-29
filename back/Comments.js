const puppeteer = require('puppeteer');
require("dotenv").config();
const fs = require('fs');
const path = require('path');

async function CommentsFunction(app,urlsInput,messagesInput) {
    const screenshots = [];
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    console.log(urlsInput);
    console.log(messagesInput);
    // Se rendre sur la page de connexion Instagram
    await page.goto('https://www.instagram.com/accounts/login', { waitUntil: "networkidle2" });
    await page.waitForSelector('input[name=username]');
    await page.type('input[name=username]', 'fodaw77731', { delay: getRandomDelay() });
    await page.type('input[name=password]', 'PasswordAdmin856726', { delay: getRandomDelay() });
    await page.click('button[type=submit]', { delay: getRandomDelay() });

    await page.waitForTimeout(8000);
    
    // Séparer les   URL et les messages en utilisant la virgule comme délimiteur
    const urls = urlsInput.split(',');
    const messages = messagesInput.split(',');

    // Vérifier si le nombre d'URL et de messages est le même
    if (urls.length !== messages.length) {
        console.log('Le nombre d\'URL et de messages ne correspond pas.');
        return;
    }

    // Traiter les URL et les messages correspondants
    for (var i = 0; i < urls.length; i++) {
        const url = urls[i].trim();
        const message = messages[i].trim();
        // Faire ce que vous souhaitez avec chaque paire URL-message
        console.log('URL:', url);
        console.log('Message:', message);
        await CommentOnPost(page,url,message,screenshots)
    }
    await handleScreenshotRequest(app,screenshots);
    await browser.close();
};


async function CommentOnPost (page,url,message,screenshots){
    // Attendre que la page de destination soit complètement chargée
await page.goto(url, { waitUntil: "networkidle2" });
console.log("Passage de l'url")
const textarea = await page.waitForSelector('textarea.x1i0vuye.xvbhtw8.x76ihet.xwmqs3e.x112ta8.xxxdfa6.x5n08af.x78zum5.x1iyjqo2.x1qlqyl8.x1d6elog.xlk1fp6.x1a2a7pz.xexx8yu.x4uap5.x18d9i69.xkhd6sd.xtt52l0.xnalus7.x1bq4at4.xaqnwrm.xs3hnx8');
await textarea.type(message, { delay: getRandomDelay() });
const publishButton = await page.waitForSelector('div.x1i10hfl.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.xdl72j9.x2lah0s.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x2lwn1j.xeuugli.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x1lku1pv.x1a2a7pz.x6s0dn4.xjyslct.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x9f619.x1ypdohk.x1i0vuye.xwhw2v2.xl56j7k.x17ydfre.x1f6kntn.x2b8uid.xlyipyv.x87ps6o.x14atkfc.x1d5wrs8.x972fbf.xcfux6l.x1qhh985.xm0m39n.xm3z3ea.x1x8b98j.x131883w.x16mih1h.xt0psk2.xt7dq6l.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.xjbqb8w.x1n5bzlp.x173jzuc.x1yc6y37[role="button"]');
await publishButton.click();
await page.waitForTimeout(5000);
await captureScreenshots(page,screenshots);
}

async function captureScreenshots(page, screenshots) {
    const folderPath = path.join(__dirname, '../back/public/screenshots');
  
    // Créer le dossier screenshots si nécessaire
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    
    const screenshotData = await page.screenshot();
    const screenshotPath = path.join(__dirname, '../back/public/screenshots', `screenshot_${Date.now()}.png`);
  
  
    fs.writeFileSync(screenshotPath, screenshotData);
    screenshots.push(screenshotPath);
}
  
async function handleScreenshotRequest(app, screenshots) {
    app.get('/api/screencomments', async (req, res) => {
      try {
        res.json({ imageUrls: screenshots });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Une erreur s\'est produite lors de la capture des screenshots' });
      }
    });
  }

async function BugInsta(page,url,post) {
    try {
    try {
        await page.waitForSelector('label.uiButton input[type="button"][name="login"]');
    } catch(error){
        console.log("Pas de popup");
    }
    NewProfilToSearch(page,url);
    // Attendre que le bouton de connexion soit présent dans la page et soit cliquable
    await page.waitForSelector('a.x1i10hfl button._acan');
    // Cliquer sur le bouton de connexion
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

// Fonction pour obtenir un délai aléatoire
function getRandomDelay() {
    return Math.floor(Math.random() * 500) + 500; // Délai entre 500 et 1000 ms
}

function getRandomDelayComment() {
    return Math.floor(Math.random() * 4000) + 1000; // Délai entre 3000 et 7000 ms (3 et 7 secondes)
}

module.exports = {
    CommentsFunction
};