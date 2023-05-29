const puppeteer = require('puppeteer');
require("dotenv").config();


async function FollowFunction(usernameInput,optionRadioFollowUnfollow) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Se rendre sur la page de connexion Instagram
    await page.goto('https://www.instagram.com/accounts/login', { waitUntil: "networkidle2" });
    await page.waitForSelector('input[name=username]'); // mailinstadefoufurieux@yopmail.com
    await page.type('input[name=username]', 'UnFouNeVauxPasDeuxFOU', { delay: 20 });
    await page.type('input[name=password]', 'PasswordAdmin856726', { delay : 20 });
    await page.click('button[type=submit]', { delay: getRandomDelay() });

    await page.waitForTimeout(8000);

 const usernames = usernameInput.split(',');

for (let i = 0; i < usernames.length; i++) {
    const username = usernames[i].trim();
    await NewProfilToSearch(page,username);
    // Utilisez la valeur de `option` selon vos besoins
    if (optionRadioFollowUnfollow === 'follow') {
    // Suivre les utilisateurs
    await FollowUser(page);
    } else if (optionRadioFollowUnfollow === 'unfollow') {
    // Désabonner des utilisateurs
    await UnfollowUser(page);
    }
    
    await page.waitForTimeout(5000);
}
    console.log("Je ferme la fenetre")
    await browser.close();
};

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
            await page.type(selector, char, { delay : getRandomDelay()});
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

//Follow un utilisateur des qu'on est sur le profil
async function FollowUser(page) {
   const button = await page.waitForSelector('button._acan._acap._acas._aj1-');
   const buttonTextElement = await button.$('.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x150jy0e.x1e558r4.x1n2onr6.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.x1q0g3np.xqjyukv.x6s0dn4.x1oa3qoh.xl56j7k');
   const actualButtonText = await page.evaluate((element) => element.textContent, buttonTextElement);
 
   if (actualButtonText === "Suivre") {
     await button.click();
   } else {
     console.log(`Le texte du bouton n'est pas Suivre.`);
   }
}

//UnFollow un utilisateur des qu'on est sur le profil
async function UnfollowUser(page) {
    console.log("Passage unfollow")
    const button = await page.waitForSelector('div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1i64zmx.x1n2onr6.x1plvlek.xryxfnj.x1iyjqo2.x2lwn1j.xeuugli.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1 button._acan._acap._acat._aj1-');
    const buttonTextElement = await button.$('.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x150jy0e.x1e558r4.x1n2onr6.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.x1q0g3np.xqjyukv.x6s0dn4.x1oa3qoh.xl56j7k');
    const actualButtonText = await page.evaluate((element) => element.textContent, buttonTextElement);
  console.log(actualButtonText);
    if (actualButtonText.includes("Suivi(e)")) {
        console.log("PassageSuivie")
        const buttonSelector = 'div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1i64zmx.x1n2onr6.x1plvlek.xryxfnj.x1iyjqo2.x2lwn1j.xeuugli.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1 button._acan._acap._acat._aj1-';
        const buttonSuivie = await page.waitForSelector(buttonSelector);
        await buttonSuivie.click();
        await page.waitForSelector('div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1pi30zi.x1swvt13.x1l90r2v.xyamay9.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1 span.x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.xvs91rp.xo1l8bm.x5n08af.x10wh9bi.x1wdrske.x8viiok.x18hxmgj');
        const buttons = await page.$$('div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1pi30zi.x1swvt13.x1l90r2v.xyamay9.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1 span.x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.xvs91rp.xo1l8bm.x5n08af.x10wh9bi.x1wdrske.x8viiok.x18hxmgj');
        if (buttons.length >= 5) {
          const fifthButton = buttons[4];
          await fifthButton.click();
        } else {
          console.log("Le cinquième bouton n'a pas été trouvé.");
        }
    }else if (actualButtonText.includes("Demandé")){
        console.log("PassageDemandé")
        await button.click();
        const buttonunfollow = await page.waitForSelector('button._a9--._a9-_');
        await buttonunfollow.click();
        console.log(`Le texte du bouton n'est pas Suivi(e) ou Demandé.`);
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
    FollowFunction
};