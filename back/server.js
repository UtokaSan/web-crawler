const express = require("express");
const crawlerSale = require("./crawlerSale")
const FollowInsta = require("./FollowInsta")
const CommentsInsta = require("./Comments")
const DisplayProfil = require("./DisplayProfil")
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

const { Client } = require('pg');
const client = new Client({
user: 'postgres',
host: 'localhost',
database: 'postgres',
password: '123',
port: 5432,
});

client.connect();

// Définit le répertoire statique
app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/crawler/sale', async (req, res) => {
    const inputSearch = req.body.inputSearch;
    await crawlerSale.indexCrawling(inputSearch, client);
    res.redirect("/sites-de-vente.html");
});

app.get('/api/produitsamazon', (req, res) => {
   transformQueryJson('produitscdiscount');
})
app.get('/api/produitsamazon', (req, res) => {
    transformQueryJson('produitsamazon');
})

function transformQueryJson (name) {
    const sql = `SELECT * FROM ${name}`;

    client.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération des données' });
        } else {
            res.json(result.rows);
        }
    });
}

app.listen(port, () => {
    console.log('Server app listening on port ' + port);
});

// Code SQL pour créer la table Produits
const createQueryTableAmazon = `
    CREATE TABLE ProduitsAmazon(  
        Id SERIAL PRIMARY KEY,
        Titre VARCHAR(255),
        Image VARCHAR(255),
        Prix VARCHAR(50),
        Texte VARCHAR(1000)
    )
`;

// Exécute la requête SQL de création de table
client.query(createQueryTableAmazon, (err, res) => {
    if (err) {
        console.error('Erreur lors de la création de la table ProduitsAmazon:', err.message);
    } else {
        console.log('Table ProduitsAmazon créée avec succès.');
    }
});

const createQueryTableCDiscount = `
    CREATE TABLE ProduitsCDiscount(  
        Id SERIAL PRIMARY KEY,
        Titre VARCHAR(255),
        Image VARCHAR(255),
        Prix VARCHAR(50),
        Texte VARCHAR(1000)
    )
`;

client.query(createQueryTableCDiscount, (err, res) => {
    if (err) {
        console.error('Erreur lors de la création de la table ProduitsCdiscount:', err.message);
    } else {
        console.log('Table ProduitsCDiscount créée avec succès.');
    }
});


app.post('/crawler/FollowInsta', async (req, res) => {
    const usernameInput = req.body.usernameInput;
    const optionRadioFollowUnfollow = req.body.option;
    await FollowInsta.FollowFunction(usernameInput,optionRadioFollowUnfollow, client);
    res.redirect("/Follow-Unfollow une-plusieurs-personnes-donnés.html");
});

app.post('/crawler/Comments', async (req, res) => {
    const url = req.body.Url;
    const message = req.body.Message;
    await CommentsInsta.CommentsFunction(url,message);
    res.redirect("/Commenter-une-plusieurs-publication-avec-plusieurs-messages-ou-un-seul.html");
});

app.post('/crawler/DisplayProfil', async (req, res) => {
    const profil = req.body.usernameInput;
    await DisplayProfil.DisplayFunction(profil);
    res.redirect("/Afficher-le-profil-d'une-personne-donné.html");
});





// Exporte le client PostgreSQL
module.exports = client;
