        const puppeteer = require('puppeteer');
        async function indexScrapping(url) {
                const browser = await puppeteer.launch();
                const page = await browser.newPage();

                if (url === "amazon") {
                        await page.goto('https://www.amazon.fr/', {waitUntil: 'networkidle2'});
                        await verifyCookie(page, "#sp-cc-accept");
                        await page.waitForSelector("input[aria-label='Rechercher Amazon.fr']");
                        await page.type("input[aria-label='Rechercher Amazon.fr']", 'Chemise');
                        await page.click("#nav-search-submit-button");
                        await page.waitForNavigation({ waitUntil: 'load' });
                        const amazon = await page.evaluate(amazonTakeProduct);
                        console.log(amazon)
                } else if (url === "cdiscount") {
                        await page.goto('https://www.cdiscount.com/', {waitUntil: 'networkidle2'});
                        await verifyCookie("button[title='Accepter']")
                        await page.waitForSelector("input[type='search']");
                        await page.type("input[type='search']", "Chemise");
                        await page.keyboard.press("Enter");
                        await page.waitForNavigation({ waitUntil: 'networkidle2' });
                        const cdiscount = await page.evaluate(cdiscountTakeProduct);
                        console.log(cdiscount)
                }
                await browser.close();
        }
        async function amazonTakeProduct () {
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
        }
        async function cdiscountTakeProduct () {
                const titleSelec = document.querySelectorAll("h2.prdtTit");
                const imgSelec = document.querySelectorAll("img.prdtBImg");
                const priceSelect = document.querySelectorAll("span.price.displayToPro.jsLpPriceFontSize")
                const allproduct = [];
                for (let i = 0; i < titleSelec.length; i++) {
                        const title = titleSelec[i].innerText;
                        const img = imgSelec[i].getAttribute('src');
                        const price = priceSelect[i].innerText;
                        allproduct.push({
                                title,
                                img,
                                price
                        });
                }
                return allproduct;
        }
        async function verifyCookie(page, selector) {
                const acceptCookie = await page.waitForSelector(selector, {visible: true, timeout: 2000});
                if (acceptCookie) {
                        return await acceptCookie.click();
                }
        }

        module.exports = {
            indexScrapping
        };