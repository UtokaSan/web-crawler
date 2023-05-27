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

    const profil = "danae";
    const url = "https://www.instagram.com/p/Csl3J6SoTSk/";
    
    
    
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


    async function CommentOnPost (page,url,message){
            // Attendre que la page de destination soit complètement chargée
        await page.goto(url, { waitUntil: "networkidle2" });
        const textarea = await page.waitForSelector('textarea.x1i0vuye.xvbhtw8.x76ihet.xwmqs3e.x112ta8.xxxdfa6.x5n08af.x78zum5.x1iyjqo2.x1qlqyl8.x1d6elog.xlk1fp6.x1a2a7pz.xexx8yu.x4uap5.x18d9i69.xkhd6sd.xtt52l0.xnalus7.x1bq4at4.xaqnwrm.xs3hnx8');
        await textarea.type(message, { delay: getRandomDelay() });
        const publishButton = await page.waitForSelector('div.x1i10hfl.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.xdl72j9.x2lah0s.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x2lwn1j.xeuugli.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x1lku1pv.x1a2a7pz.x6s0dn4.xjyslct.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x9f619.x1ypdohk.x1i0vuye.xwhw2v2.xl56j7k.x17ydfre.x1f6kntn.x2b8uid.xlyipyv.x87ps6o.x14atkfc.x1d5wrs8.x972fbf.xcfux6l.x1qhh985.xm0m39n.xm3z3ea.x1x8b98j.x131883w.x16mih1h.xt0psk2.xt7dq6l.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.xjbqb8w.x1n5bzlp.x173jzuc.x1yc6y37[role="button"]');
        await publishButton.click();
    }
    CommentOnPost(page,url);
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
