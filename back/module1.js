        const puppeteer = require('puppeteer');

        async function indexScrapping(url) {
                const browser = await puppeteer.launch({headless: false});
                const page = await browser.newPage();

                if (url === "amazon") {
                        await page.goto('https://www.amazon.fr/', {waitUntil: 'networkidle2'});
                        await page.click("#sp-cc-accept");
                        await page.waitForSelector("input[aria-label='Rechercher Amazon.fr']");
                        await page.type("input[aria-label='Rechercher Amazon.fr']", 'Chemise');
                        await page.click("#nav-search-submit-button");
                        await page.waitForNavigation({ waitUntil: 'networkidle2' });
                        const amazon = await page.evaluate(() => {
                                const priceSelector = document.querySelectorAll('span.a-price-whole')
                                const titleSelector = document.querySelectorAll('span.a-size-base-plus.a-color-base.a-text-normal')
                                const imgElement = document.querySelector('img.s-image');
                                const src = imgElement.getAttribute('src');
                                const allproducts = [];
                                for (let i = 0; i < priceSelector.length; i++) {
                                        const title = titleSelector[i].innerText;
                                        const img = src;
                                        const price = priceSelector[i].innerText + "€";
                                        allproducts.push({
                                                title,
                                                img,
                                                price
                                        });
                                }
                                return allproducts
                        })
                        console.log(amazon)
                } else if (url === "cdiscount") {
                        await page.goto('https://www.cdiscount.com/', {waitUntil: 'networkidle2'});
                        await page
                }
                await browser.close();
        }

        module.exports = {
            indexScrapping
        };