const puppeteer = require('puppeteer');
const {Client} = require('pg');
const {all} = require("express/lib/application");

async function indexCrawling(inputSearch, client) {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await deleteTableData("produitsamazon", client);
    await deleteTableData("produitsaliexpress", client);
    await runAmazon(page, client, inputSearch);
    await runAliexpress(page, client, inputSearch)
}

async function runAliexpress(page, client, inputSearch) {
    await page.goto('https://fr.aliexpress.com/', {waitUntil: 'networkidle2'});
    await page.waitForSelector("input[name='SearchText']");
    await page.waitForTimeout(5000);
    await page.type("#search-key", inputSearch);
    await page.waitForTimeout(5000);
    await page.keyboard.press("Enter");
    await page.waitForNavigation({waitUntil: 'networkidle2'});
    const aliexpress = await takeAllLinkAliexpress(page)
    for (let i = 0; i < 5; i++) {
        if (!aliexpress[i].startsWith("https://")) {
            aliexpress[i] = "https:" + aliexpress[i];
        }
        await page.goto(aliexpress[i], {waitUntil: 'networkidle2'});
        const takeInfo = await page.evaluate(takeInformationAllProduct, "span.product-price-value", ".product-title-text", ".magnifier-image", ".product-reviewer-sold");
        await insertDB(takeInfo, client, "aliexpress");
    }
}

async function runAmazon(page, client, inputSearch) {
    await page.goto('https://www.amazon.fr/', {waitUntil: 'networkidle2'});
    await verifyCookie(page, "#sp-cc-accept");
    await page.waitForSelector("input[aria-label='Rechercher Amazon.fr']");
    await page.type("input[aria-label='Rechercher Amazon.fr']", inputSearch);
    await page.click("#nav-search-submit-button");
    await page.waitForNavigation({waitUntil: 'load'});
    const amazon = await page.evaluate(takeAllLinkAmazon, "a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal")
    for (let i = 0; i < 5; i++) {
        await page.goto(amazon[i], {waitUntil: 'networkidle2'});
        const takeInfo = await page.evaluate(takeInformationAllProduct, "span.a-offscreen", "span#productTitle", "img[data-a-image-name='landingImage']", "#productDescription > p > span");
        await insertDB(takeInfo, client, "amazon");
    }
}

async function takeAllLinkAliexpress(page) {
    const selector = ".manhattan--container--1lP57Ag.cards--gallery--2o6yJVt.search-card-item";
    const allLinks = await page.$$eval(selector, elements => {
        return elements.map(element => element.getAttribute("href"));
    });
    const uniqueLinks = [...new Set(allLinks)];
    return uniqueLinks;
}

async function takeAllLinkAmazon(selector) {
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

async function insertDB(takeInfo, client, table) {
    let insertQuery;
    for (const product of takeInfo) {
        if (table === "amazon") {
            insertQuery = `
                INSERT INTO ProduitsAmazon (Titre, Image, Prix, Texte)
                VALUES ($1, $2, $3, $4) RETURNING Id
            `;
        }
        if (table === "aliexpress") {
            insertQuery = `
                INSERT INTO ProduitsAliexpress (Titre, Image, Prix, Texte)
                VALUES ($1, $2, $3, $4) RETURNING Id
            `;
        }
        const texte = "Description du produit";
        try {
            const res = await client.query(insertQuery, [product.productTitle, product.imageLink, product.priceOrNot, product.description]);
            console.log('Nouvelle ligne insérée avec succès.');
        } catch (err) {
            console.error('Erreur lors de l\'insertion d\'une nouvelle ligne:', err.message);
        }
    }
}

async function deleteTableData(tableName, client) {
    try {
        const deleteQuery = `DELETE
                             FROM ${tableName}`;
        await client.query(deleteQuery);
        console.log(`Contenu de la table ${tableName} supprimé avec succès.`);
    } catch (err) {
        console.error('Erreur lors de la suppression du contenu de la table:', err.message);
    }
}

async function takeInformationAllProduct(selectorPrice, selectorProduct, selectorImage, selectorDescription) {
    const products = [];
    const price = document.querySelector(selectorPrice);
    const priceOrNot = price ? price.innerHTML : document.querySelector("span.uniform-banner-box-price").innerHTML;
    const productTitle = document.querySelector(selectorProduct).innerText;
    const imageLink = document.querySelector(selectorImage).src;
    const descriptionElement = document.querySelector(selectorDescription);
    const description = descriptionElement ? descriptionElement.innerHTML : "no description";
    products.push({
        productTitle,
        imageLink,
        priceOrNot,
        description
    });
    return products;
}

async function verifyCookie(page, selector) {
    const acceptCookie = await page.waitForSelector(selector, {visible: true, timeout: 2000});
    if (acceptCookie) {
        return await acceptCookie.click();
    }
}

module.exports = {
    indexCrawling
};