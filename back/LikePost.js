const puppeteer = require('puppeteer');
require("dotenv").config();
const fs = require('fs');
const path = require('path');



async function LikeFunction (number_input1,number_input2,checked,urlInput,userInput,likeChoice,app) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
  
    console.log(checked);
    console.log(likeChoice);

    const screenshots = [];
    // Se rendre sur la page de connexion Instagram
    await page.goto('https://www.instagram.com/accounts/login', { waitUntil: "networkidle2" });
    await page.waitForSelector('input[name=username]');
    await page.type('input[name=username]', 'fodaw77731', { delay: getRandomDelay() });
    await page.type('input[name=password]', 'PasswordAdmin856726', { delay: getRandomDelay() });
    await page.click('button[type=submit]', { delay: getRandomDelay() });

    await page.waitForTimeout(8000);
    //Like Choice
if (likeChoice === "Like"){
    //1 to 50 Choice
    if (checked === "unAcinq"){
      await NewProfilToSearch(page,userInput);
      const url = await FirstLinkFromProfil(page);
      for (let i = number_input1 - 1; i < number_input2; i++) {
        const link = url[i];
        await page.goto(link, { waitUntil: "networkidle2" });
        await LikePost(page,url[i],userInput);
        await captureScreenshots(page,screenshots);
      }
      //Specific choice (url)
    }else if ((checked === "Specific")){
      const urls = urlInput.split(',');
      for (const url of urls) {
        const trimmedUrl = url.trim(); // Supprimer les espaces vides autour de chaque URL
        await page.goto(trimmedUrl, { waitUntil: "networkidle2" });
        await LikePost(page,url,"leagueoflegends");
        await captureScreenshots(page,screenshots);
      }
    }
    //Unlike Choice
  }else if (likeChoice === "Unlike"){
    //1 to 50 Choice
    if (checked === "unAcinq"){
      await NewProfilToSearch(page,userInput);
      const url = await FirstLinkFromProfil(page);
      for (let i = number_input1 - 1; i < number_input2; i++) {
        const link = url[i];
        await page.goto(link, { waitUntil: "networkidle2" });
        await UnlikePost(page,url[i],userInput);
        await captureScreenshots(page,screenshots);
      }
      //Specific choice (url)
    }else if ((checked === "Specific")){
      const urls = urlInput.split(',');
      for (const url of urls) {
        const trimmedUrl = url.trim();
        await page.goto(trimmedUrl, { waitUntil: "networkidle2" });
        await UnlikePost(page,url,"leagueoflegends");
        await captureScreenshots(page,screenshots);
      }
    }
  }
    await handleScreenshotRequest(app,screenshots);
    await browser.close();
};

//profil = pseudo 
async function NewProfilToSearch(page,profil) {
  await page.goto('https://www.instagram.com/' + profil, { waitUntil: "networkidle2" });
}

async function FirstLinkFromProfil(page) {
  let allHrefs = [];
  for (let i = 0; i < 3; i++) {
    const hrefs = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('article.x1iyjqo2 a[href]'));
      return links.map(link => link.href);
    });
    const lastLinkDifferent = hrefs[hrefs.length - 1] !== allHrefs[allHrefs.length - 1];
    if (!lastLinkDifferent || hrefs.length === 0) {
      break;
    }
    allHrefs = allHrefs.concat(hrefs);
    await scrollPageToBottom(page);
    await page.waitForTimeout(4000);
  }
  console.log(allHrefs);
  return allHrefs;
}

async function LikePost (page,url,userInput){
  const svgSelector = 'span.xp7jhwk svg';
    await BugInsta(page,userInput,url);
    await page.waitForSelector(svgSelector);
  const svgHandle = await page.$(svgSelector);
  const colorValue = await page.evaluate((svg) => {
    const svgElement = svg;
    return svgElement.getAttribute('color');
  }, svgHandle);
  //rgb(255, 48, 64) = red
  if (colorValue == "rgb(255, 48, 64)"){
      console.log("Le post " + url + "demandé possède déjà un j'aime")
  }else {
  const buttonSelector = 'span.xp7jhwk button';
  await page.waitForSelector(buttonSelector);
  const firstButtonHandle = await page.$(buttonSelector);
  await page.waitForTimeout(getRandomDelay());
  await firstButtonHandle.click();
  }
}

async function UnlikePost (page,url,userInput){
  const svgSelector = 'span.xp7jhwk svg';
    await BugInsta(page,userInput,url);
    await page.waitForSelector(svgSelector);
  await page.waitForSelector(svgSelector);
  const svgHandle = await page.$(svgSelector);
  const colorValue = await page.evaluate((svg) => {
    const svgElement = svg;
    return svgElement.getAttribute('color');
  }, svgHandle);
  //"rgb(38, 38, 38)" = not red
  if (colorValue == "rgb(38, 38, 38)"){
      console.log("Le post " + url + "demandé ne possède pas de like !")
  }else {
  const buttonSelector = 'span.xp7jhwk button';
  await page.waitForSelector(buttonSelector);
  const firstButtonHandle = await page.$(buttonSelector);
  await page.waitForTimeout(getRandomDelay());
  await firstButtonHandle.click();
  }
}

function getRandomDelay() {
    return Math.floor(Math.random() * 500) + 500;
}

function getRandomDelayComment() {
    return Math.floor(Math.random() * 4000) + 1000;
}

async function handleScreenshotRequest(app, screenshots) {
  app.get('/api/screenlike', async (req, res) => {
    try {
      res.json({ imageUrls: screenshots });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Une erreur s\'est produite lors de la capture des screenshots' });
    }
  });
}

async function captureScreenshots(page, screenshots) {
  const folderPath = path.join(__dirname, '../back/public/screenshots');
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  const screenshotData = await page.screenshot();
  const screenshotPath = path.join(__dirname, '../back/public/screenshots', `screenshot_${Date.now()}.png`);
  fs.writeFileSync(screenshotPath, screenshotData);
  screenshots.push(screenshotPath);
}

async function scrollPageToBottom(page) {
  const scrollCount = 5;
  const distance = 100;
  const delay = 200;

  for (let i = 0; i < scrollCount; i++) {
    await page.evaluate(async (scrollDistance, scrollDelay) => {
      await new Promise((resolve) => {
        window.scrollBy(0, scrollDistance);
        setTimeout(resolve, scrollDelay);
      });
    }, distance, delay);
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
module.exports = {
  LikeFunction
};