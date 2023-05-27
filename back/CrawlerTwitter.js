const puppeteer = require('puppeteer');
require("dotenv").config();

const url = "";

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
async function TwitterConnexion(page){
        // Se rendre sur la page de connexion Instagram
        await page.goto('https://twitter.com/', { waitUntil: "networkidle2" });
        await page.waitForSelector('a[href="/login"][role="link"].css-4rbku5');   
        await page.click('a[href="/login"][role="link"].css-4rbku5');

        await page.waitForSelector('input.r-30o5oe');   
        await page.type('input.r-30o5oe', 'ProjetYnov@proton.me',{ delay : 20 });

        const buttons = await page.$$('div[role="button"]');

    if (buttons.length >= 3) {
      await buttons[2].click(); // Cliquer sur le 3ème bouton (l'index est 2 car les index commencent à 0)
    } else {
      console.log("Le 3ème bouton n'a pas été trouvé.");
    }
    try {
        await page.waitForSelector('input[name="text"]');
        await page.type('input[name="text"]', 'Pyrnoojvet', { delay: 20});
        await page.$eval('div[data-testid="ocfEnterTextNextButton"]', (button) => {
          button.click();
        });
    } catch (error) {
        // Gérer l'erreur ici
        console.error("Erreur : l'élément n'a pas été trouvé ou une autre erreur s'est produite.", error);
    }
        await page.waitForSelector('input[name=password]');
        await page.type('input[name=password]', 'PasswordAdmin856726', { delay: 20});
        await page.waitForSelector('div[data-testid="LoginForm_Login_Button"]');
    await page.$eval('div[data-testid="LoginForm_Login_Button"]', (button) => {
      button.click();
    });
    try {
        await page.waitForSelector('div[role="button"].css-18t94o4');
    await page.click('div[role="button"].css-18t94o4');
    } catch (error){
        console.error("Erreur : l'élément n'a pas été trouvé .", error);
    }
    await page.waitForTimeout(4000);
}


async function PublishTweet(page){
    await page.waitForSelector('.css-1dbjc4n.r-13qz1uu.r-1g40b8q'); // Attendre que le div soit chargé
    const divToClick = await page.$('.css-1dbjc4n.r-13qz1uu.r-1g40b8q'); // Sélectionner le div à cliquer
    await divToClick.click(); // Cliquer sur le div
    await page.waitForSelector('div[data-testid="tweetTextarea_0"]'); // Attendre que l'élément d'écriture soit chargé

    const tweetInput = await page.$('div[data-testid="tweetTextarea_0"]'); // Sélectionner l'élément d'écriture
    await tweetInput.type('Hello, Twitter!',{ delay: getRandomDelay()}); // Écrire du texte dans l'élément
    await page.waitForSelector('div[data-testid="tweetButtonInline"]'); // Attendre que le bouton soit chargé

    const tweetButton = await page.$('div[data-testid="tweetButtonInline"]'); // Sélectionner le bouton
    await tweetButton.click(); // Cliquer sur le bouton
  
}

const follow = "leagueoflegends"
async function FollowUsers(page,follow){
    // Attendre que la page de destination soit complètement chargée
    await page.goto("https://twitter.com/" + follow, { waitUntil: "networkidle2" });

    
    try {
    const followButton = await page.$('div[data-testid="577401044-follow"] span');
    const followText = await page.evaluate(button => button.textContent, followButton);
    console.log(followText);
    await page.waitForSelector('div[data-testid="577401044-follow"]'); // Attendre que le bouton soit chargé
    const followButtonClick = await page.$('div[data-testid="577401044-follow"]'); // Sélectionner le bouton
    await followButtonClick.click(); // Cliquer sur le bouton
    } catch (error) {
        console.log("Deja follow a cet utilisateur")
    }
} 

async function UnfollowUsers(page,follow){
    // Attendre que la page de destination soit complètement chargée
    await page.goto("https://twitter.com/" + follow, { waitUntil: "networkidle2" });

    await page.waitForSelector('div[dir="ltr"] span.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0'); // Attendre que l'élément soit chargé

    try{
    const followButton = await page.$('div[data-testid="577401044-unfollow"] span');
    const followText = await page.evaluate(button => button.textContent, followButton);
    console.log(followText);
    const followingButton = await page.waitForSelector('div[aria-label^="Following"]');
    await followingButton.click();
    await page.waitForTimeout(4000);
    const unfollowButton = await page.waitForSelector('div[data-testid="confirmationSheetConfirm"]');
    await unfollowButton.click();
    } catch (error) {
        console.log("Deja Unfollow a cet utilisateur")
    }
} 



    await TwitterConnexion(page);
    await UnfollowUsers(page,follow);
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
