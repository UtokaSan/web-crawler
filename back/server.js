const express = require("express");
const crawlerSale = require("./crawlerSale")
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

app.get('/crawler/sale', async (req, res) => {
    const text = await crawlerSale.indexCrawling(client);
    res.json(text)
});

app.get('/api/produits', (req, res) => {
    const sql = 'SELECT * FROM produits';

    client.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération des données' });
        } else {
            res.json(result.rows);
        }
    });
})

app.listen(port, () => {
    console.log('Server app listening on port ' + port);
});

// Code SQL pour créer la table Produits
const createTableQuery = `
    CREATE TABLE Produits(  
        Id SERIAL PRIMARY KEY,
        Titre VARCHAR(255),
        Image VARCHAR(255),
        Prix VARCHAR(50),
        Texte VARCHAR(1000)
    )
`;

// Exécute la requête SQL de création de table
client.query(createTableQuery, (err, res) => {
    if (err) {
        console.error('Erreur lors de la création de la table Produits:', err.message);
    } else {
        console.log('Table Produits créée avec succès.');
    }
});

// Exporte le client PostgreSQL
module.exports = client;
