const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const scrapeLetterboxd = require("./scrapingLetterboxd")

app.get('/api', async (req, res) => {
    const text = await scrapeLetterboxd.scrapeLetterboxd();
    res.json(text);
});

app.listen(port, () => {
    console.log('Server app listening on port ' + port);
});