const puppeteer = require('puppeteer');
require("dotenv").config();

const url = "";

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
async function TwitterConnexion(page){
        await page.goto('https://twitter.com/', { waitUntil: "networkidle2" });
        await page.waitForSelector('a[href="/login"][role="link"].css-4rbku5');   
        await page.click('a[href="/login"][role="link"].css-4rbku5');

        await page.waitForSelector('input.r-30o5oe');   
        await page.type('input.r-30o5oe', 'ProjetYnov@proton.me',{ delay : 20 });

        const buttons = await page.$$('div[role="button"]');

    if (buttons.length >= 3) {
      await buttons[2].click();
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
    await page.waitForSelector('.css-1dbjc4n.r-13qz1uu.r-1g40b8q');
    const divToClick = await page.$('.css-1dbjc4n.r-13qz1uu.r-1g40b8q');
    await divToClick.click();
    await page.waitForSelector('div[data-testid="tweetTextarea_0"]');

    const tweetInput = await page.$('div[data-testid="tweetTextarea_0"]');
    await tweetInput.type('Hello, Twitter!',{ delay: getRandomDelay()});
    await page.waitForSelector('div[data-testid="tweetButtonInline"]');

    const tweetButton = await page.$('div[data-testid="tweetButtonInline"]');
    await tweetButton.click();
  
}

const follow = "leagueoflegends"
async function FollowUsers(page,follow){
    await page.goto("https://twitter.com/" + follow, { waitUntil: "networkidle2" });
    try {
    const followButton = await page.$('div[data-testid="577401044-follow"] span');
    const followText = await page.evaluate(button => button.textContent, followButton);
    console.log(followText);
    await page.waitForSelector('div[data-testid="577401044-follow"]');
    const followButtonClick = await page.$('div[data-testid="577401044-follow"]');
    await followButtonClick.click();
    } catch (error) {
        console.log("Deja follow a cet utilisateur")
    }
} 

async function UnfollowUsers(page,follow){
    await page.goto("https://twitter.com/" + follow, { waitUntil: "networkidle2" });
    await page.waitForSelector('div[dir="ltr"] span.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0');
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
    //await browser.close();
})();

function getRandomDelay() {
    return Math.floor(Math.random() * 500) + 500;
}

function getRandomDelayComment() {
    return Math.floor(Math.random() * 4000) + 1000;
}
