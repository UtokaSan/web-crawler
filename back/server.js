const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const module1 = require("./module1")

app.get('/api', async (req, res) => {
    const text = await module1.indexScrapping("amazon");
    res.json(text);
});

app.listen(port, () => {
    console.log('Server app listening on port ' + port);
});
