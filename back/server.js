const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const crawlerSale = require("./crawlerSale")

app.get('/api', async (req, res) => {
    const text = await crawlerSale.indexScrapping("cdiscount");
    res.json(text);
});

app.listen(port, () => {
    console.log('Server app listening on port ' + port);
});
