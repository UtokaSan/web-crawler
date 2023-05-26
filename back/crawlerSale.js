const puppeteer = require('puppeteer');
const {all} = require("express/lib/application");
async function indexScrapping(url) {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    if (url === "amazon") {
        await page.goto('https://www.amazon.fr/', {waitUntil: 'networkidle2'});
        await verifyCookie(page, "#sp-cc-accept");
        await page.waitForSelector("input[aria-label='Rechercher Amazon.fr']");
        await page.type("input[aria-label='Rechercher Amazon.fr']", 'Chemise');
        await page.click("#nav-search-submit-button");
        await page.waitForNavigation({waitUntil: 'load'});
        const amazon = await page.evaluate(takeAllLinkAmazon, "a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal")
        for (let i = 0; i < 5; i++) {
            await page.goto(amazon[i], {waitUntil: 'load'});
            const takepr = await page.evaluate(takeInformationAllProduct, "span.a-offscreen", "span#productTitle", "img[data-a-image-name='landingImage']");
            takepr.forEach(products => {
                console.log("price :" + products.price);
                console.log("titre :" + products.productTitle);
                console.log("image :" + products.imageLink);
            })
        }
    }
    if (url === "cdiscount") {
        await page.goto('https://www.cdiscount.com/', {waitUntil: 'networkidle2'});
        const acceptCookie = await page.waitForSelector("button[title='Accepter']", {visible: true, timeout: 2000});
        await acceptCookie.click()
        await page.waitForSelector("input[type='search']");
        await page.type("input[type='search']", "Chemise");
        await page.keyboard.press("Enter");
        await page.waitForNavigation({waitUntil: 'networkidle2'});
        const cdiscount = await page.evaluate(takeAllLinkAmazon, "a[value='Voir']");
        console.log(cdiscount);
    }
}
async function takeAllLinkAmazon (selector) {
    const allLink = document.querySelectorAll(selector);
    const allproduct = [];
    for (let i = 0; i < allLink.length; i++) {
        const link = allLink[i].href;
        if (!allproduct.includes(link)) {
            allproduct.push(link);
        }
    }
    console.log('return', allproduct);
    return allproduct;
}


async function takeInformationAllProduct (selectorPrice, selectorProduct, selectorImage) {
    const products = [];
    const price = document.querySelector(selectorPrice).innerText;
    const productTitle = document.querySelector(selectorProduct).innerText;
    const imageLink = document.querySelector(selectorImage).src;
    products.push({
        productTitle,
        imageLink,
        price
    });
    return products;
}

async function verifyCookie(page, selector) {
    const acceptCookie = await page.waitForSelector(selector, { visible: true, timeout: 2000 });
    if (acceptCookie) {
        return await acceptCookie.click();
    }
}

module.exports = {
    indexScrapping
};
