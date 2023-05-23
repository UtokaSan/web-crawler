const puppeteer = require('puppeteer');

async function indexScrapping() {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto('https://www.awwwards.com/');

        const text = await page.evaluate(() => {
            const div = document.querySelectorAll('.list-sites__item');

            return Array.from(div).map((div) => div.textContent.trim());
        });

        await browser.close();

        console.log(text)
}

module.exports = {
    indexScrapping
};