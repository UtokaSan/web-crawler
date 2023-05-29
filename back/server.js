const express = require("express");
const crawlerSale = require("./crawlerSale")
const FollowInsta = require("./FollowInsta")
const CommentsInsta = require("./Comments")
const DisplayProfil = require("./DisplayProfil")
const LikePost = require("./LikePost")
const AnalyseComments = require("./AnalyseComments")
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

app.get('/crawler/sale', async (req, res) => {
    const inputSearch = req.body.inputSearch;
    await crawlerSale.indexCrawling(inputSearch, client);
    res.redirect("/sites-de-vente.html");
});

app.get('/api/produitsamazon', (req, res) => {
   transformQueryJson('produitscdiscount',res);
})
app.get('/api/produitsamazon', (req, res) => {
    transformQueryJson('produitsamazon',res);
})
app.get('/api/analyse', (req, res) => {
    transformQueryJson('comments',res);
})

app.get('/api/profil', (req, res) => {
    transformQueryJson('profil',res);
})

app.get('/api/profildetail', (req, res) => {
    transformQueryJson('profildetail',res);
})


function transformQueryJson (name,res) {
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

const createQueryTableComments = `
CREATE TABLE Comments(
    Id SERIAL PRIMARY KEY,
    Commentaires VARCHAR(255),
    Score INT
 )
`;

client.query(createQueryTableComments, (err, res) => {
    if (err) {
        console.error('Erreur lors de la création de la table CommentsTable:', err.message);
    } else {
        console.log('Table CommentsTable créée avec succès.');
    }
});


const createQueryTableSmiley = `
CREATE TABLE emoticones(
    Id SERIAL PRIMARY KEY,
    Smiley VARCHAR(255),
    Score INT
 )
`;

client.query(createQueryTableSmiley, (err, res) => {
    if (err) {
        console.error('Erreur lors de la création de la table TableSmiley:', err.message);
    } else {
        console.log('Table TableSmiley créée avec succès.');
    }
});

const createQueryProfil = `
    CREATE TABLE Profil(
        Id SERIAL PRIMARY KEY,
        Image VARCHAR(500),
        Pseudo VARCHAR(500),
        Publication VARCHAR(500),
        Followers VARCHAR(500),
        Suivie VARCHAR(500),
        Description VARCHAR(500),
        Contact VARCHAR(500)
 )
`;

client.query(createQueryProfil, (err, res) => {
    if (err) {
        console.error('Erreur lors de la création de la table Profil:', err.message);
    } else {
        console.log('Table Profil créée avec succès.');
    }
});

const createQueryProfildetail = `
    CREATE TABLE Profildetail(
        Id SERIAL PRIMARY KEY,
        image VARCHAR(500),
        text VARCHAR(500)
 )
`;

client.query(createQueryProfildetail, (err, res) => {
    if (err) {
        console.error('Erreur lors de la création de la table Profildetail:', err.message);
    } else {
        console.log('Table Profildetail créée avec succès.');
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
    await DisplayProfil.DisplayFunction(profil,client);
    res.redirect("/Afficher-le-profil-d'une-personne-donné.html");
});

app.post('/crawler/Analyse', async (req, res) => {
    const profil = req.body.usernameInput;
    await AnalyseComments.AnalyseFunction(client,profil);
    res.redirect("/Afficher-le-profil-d'une-personne-donné.html");
});

app.post('/crawler/LikePost', async (req, res) => {
    const number_input2 = req.body.number_input2;
    const number_input1 = req.body.number_input1;
    const checked = req.body.checked;
    const urlInput = req.body.UrlInput;
    const userInput = req.body.UserInput;
    const likeChoice = req.body.Like;

    console.log(number_input2);
    console.log(number_input1);
    
    await LikePost.LikeFunction(number_input1,number_input2,checked,urlInput,userInput,likeChoice,app);
    res.redirect("/page-Aimer-un-ou-plusieurs-post.html");
});

async function EmoticoneAdd(){
    const deleteQuery = `DELETE  FROM emoticones`;
    await client.query(deleteQuery);

    const emoticons = [
        { smiley: '❤️', score: 2 }, // Très positif
        { smiley: '🌊', score: 1 }, // Très positif
        { smiley: '💙', score: 2 }, // Très positif
        { smiley: '🤷', score: 0 }, // Très positif
        { smiley: '🔥', score: 2 }, // Très positif
        { smiley: '✨', score: 1 }, // Très positif
        { smiley: '😃', score: 2 }, // Très positif
        { smiley: '🥰', score: 2 }, // Très positif
        { smiley: '😊', score: 1 }, // Positif
        { smiley: '🙂', score: 0 }, // Neutre
        { smiley:'😊', score: 1 },
        { smiley:'😍', score: 2 },
        { smiley:'😎', score: 1 },
        { smiley:'😇', score: 1 },
        { smiley:'🤩', score: 2 },
        { smiley:'😂', score: 2 },
        { smiley:'🤣', score: 2 },
        { smiley:'😆', score: 2 },
        { smiley:'😁', score: 2 },
        { smiley:'😋', score: 1 },
        { smiley:'😜', score: 1 },
        { smiley:'😝', score: 1 },
        { smiley:'🤪', score: 1 },
        { smiley:'😛', score: 1 },
        { smiley:'🤓', score: 1 },
        { smiley:'🤠', score: 1 },
        { smiley:'😌', score: 0 },
        { smiley:'😔', score: -1},
        { smiley:'😞', score: -1},
        { smiley:'😢', score: -2},
        { smiley:'😭', score: -2 },
        { smiley:'😓', score: -1 },
        { smiley:'😥', score: -1 },
        { smiley:'🙁', score: -1 },
        { smiley:'😟', score: -1 },
        { smiley:'😖', score: -1 },
        { smiley:'😩', score: -2 },
        { smiley:'😫', score: -2 },
        { smiley:'😤', score: -1 },
        { smiley:'😡', score: -2 },
        { smiley:'😠', score: -2 },
        { smiley:'🤬', score: -2 },
        { smiley:'😷', score: -1 },
        { smiley:'🤒', score: -1 },
        { smiley:'🤕', score: -1 },
        { smiley:'🤢', score: -1 },
        { smiley:'🤮', score: -2 },
        { smiley:'🤧', score: -1 },
        { smiley:'😇', score: 1 },
        { smiley:'😈', score: -1 },
        { smiley:'👿', score: -2 },
        { smiley:'👻', score: 1 },
        { smiley:'💀', score: -2 },
        { smiley:'☠️', score: -2 },
        { smiley:'🤡', score: -1 },
        { smiley:'💩', score: -2},
        { smiley:'🙈', score: 0 },
        { smiley:'🙉', score: 0 },
        { smiley:'🙊', score: 0 },
        { smiley:'💪', score: 1 },
        { smiley:'👍', score: 1 },
        { smiley:'👎', score: -1},
        { smiley:'👊', score: 1 },
        { smiley:'🤛', score: 1 },
        { smiley:'🤜', score: 1 },
        { smiley:'🤞', score: 1 },
        { smiley:'✌️', score: 1 },
        { smiley:'🤟', score: 1 },
        { smiley:'🤘', score: 1 },
        { smiley:'👌', score: 1 },
        { smiley:'👏', score: 1 },
        { smiley:'🙌', score: 1 },
        { smiley:'👋', score: 1 },
        { smiley:'🤙', score: 1 },
        { smiley:'✋', score: 1 },
        { smiley:'🖐️', score: 1 },
        { smiley:'🖖', score: 1 },
        { smiley:'🤟', score: 1 },
        { smiley:'🤝', score: 1 },
        { smiley:'🙏', score: 1 },
        { smiley:'💅', score: 1 },
        { smiley:'👄', score: 0},
        { smiley:'👅', score: 0},
        { smiley:'👂', score: 0},
        { smiley:'👃', score: 0},
        { smiley:'👣', score: 0},
        { smiley:'👁️‍🗨️', score: 0},
        { smiley:'👀', score: 0},
        { smiley:'👤', score: 0},
        { smiley:'👥', score: 0},
        { smiley:'🗣️', score: 0 },
        { smiley:'🧠', score: 0 },
        { smiley:'🦾', score: 1 },
        { smiley:'🦿', score: 1 },
        { smiley:'🦻', score: 0 },
        { smiley:'🦼', score: 1 },
        { smiley:'🦽', score: 1 },
        { smiley:'👶', score: 1 },
        { smiley:'🧒', score: 1 },
        { smiley:'👦', score: 1 },
        { smiley:'👧', score: 1 },
        { smiley:'🧑', score: 0 },
        { smiley:'👨', score: 0 },
        { smiley:'👩', score: 0 },
        { smiley:'👴', score: 0 },
        { smiley:'👵', score: 0 },
        { smiley:'👮', score: 0 },
        { smiley:'👷', score: 0 },
        { smiley:'💂', score: 0 },
        { smiley:'🕵️', score: 0 },
        { smiley:'👩‍⚕️', score: 1 },
        { smiley:'👨‍⚕️', score: 1 },
        { smiley:'👩‍🎓', score: 1 },
        { smiley:'👨‍🎓', score: 1 },
        { smiley:'👩‍🏫', score: 1 },
        { smiley:'👨‍🏫', score: 1 },
        { smiley:'👩‍⚖️', score: 1 },
        { smiley:'👨‍⚖️', score: 1 },
        { smiley:'👩‍🌾', score: 1 },
        { smiley:'👨‍🌾', score: 1 },
        { smiley:'👩‍🍳', score: 1 },
        { smiley:'👨‍🍳', score: 1 },
        { smiley:'👩‍🔧', score: 1 },
        { smiley:'👨‍🔧', score: 1 },
        { smiley:'👩‍🏭', score: 1 },
        { smiley:'👨‍🏭', score: 1 },
        { smiley:'👩‍💼', score: 1 },
        { smiley:'👨‍💼', score: 1 },
        { smiley:'👩‍🔬', score: 1 },
        { smiley:'👨‍🔬', score: 1 },
        { smiley:'👩‍💻', score: 1 },
        { smiley:'👨‍💻', score: 1 },
        { smiley:'👩‍🎤', score: 1 },
        { smiley:'👨‍🎤', score: 1 },
        { smiley:'👩‍🎨', score: 1 },
        { smiley:'👨‍🎨', score: 1 },
        { smiley:'👩‍✈️', score: 1 },
        { smiley:'👨‍✈️', score: 1 },
        { smiley:'👩‍🚀', score: 1 },
        { smiley:'👨‍🚀', score: 1 },
        { smiley:'👩‍🚒', score: 1 },
        { smiley:'👨‍🚒', score: 1 },
        { smiley:'👮‍♀️', score: 0 },
        { smiley:'👮‍♂️', score: 0 },
        { smiley:'👷‍♀️', score: 0 },
        { smiley:'👷‍♂️', score: 0 },
        { smiley:'💂‍♀️', score: 0 },
        { smiley:'💂‍♂️', score: 0 },
        { smiley:'🕵️‍♀️', score: 0 },
        { smiley:'🕵️‍♂️', score: 0 },
        { smiley:'👩‍⚕️', score: 1 },
        { smiley:'👨‍⚕️', score: 1 },
        { smiley:'👩‍🎓', score: 1 },
        { smiley:'👨‍🎓', score: 1 },
        { smiley:'👩‍🏫', score: 1 },
        { smiley:'👨‍🏫', score: 1 },
        { smiley:'👩‍⚖️', score: 1 },
        { smiley:'👨‍⚖️', score: 1 },
        { smiley:'👩‍🌾', score: 1 },
        { smiley:'👨‍🌾', score: 1 },
        { smiley:'👩‍🍳', score: 1 },
        { smiley:'👨‍🍳', score: 1 },
        { smiley:'👩‍🔧', score: 1 },
        { smiley:'👨‍🔧', score: 1 },
        { smiley:'👩‍🏭', score: 1 },
        { smiley:'👨‍🏭', score: 1 },
        { smiley:'👩‍💼', score: 1 },
        { smiley:'👨‍💼', score: 1 },
        { smiley:'👩‍🔬', score: 1 },
        { smiley:'👨‍🔬', score: 1 },
        { smiley:'👩‍💻', score: 1 },
        { smiley:'👨‍💻', score: 1 },
        { smiley:'👩‍🎤', score: 1 },
        { smiley:'👨‍🎤', score: 1 },
        { smiley:'👩‍🎨', score: 1 },
        { smiley:'👨‍🎨', score: 1 },
        { smiley:'👩‍✈️', score: 1 },
        { smiley:'👨‍✈️', score: 1 },
        { smiley:'👩‍🚀', score: 1 },
        { smiley:'👨‍🚀', score: 1 },
        { smiley:'👩‍🚒', score: 1 },
        { smiley:'👨‍🚒', score: 1 },
        { smiley:'👸', score: 1 },
        { smiley:'🤴', score: 1 },
        { smiley:'🎅', score: 1 },
        { smiley:'🤶', score: 1 },
        { smiley:'🧙‍♀️', score: 1 },
        { smiley:'🧙‍♂️', score: 1 },
        { smiley:'🧝‍♀️', score: 1 },
        { smiley:'🧝‍♂️', score: 1 },
        { smiley:'🧛‍♀️', score: 1 },
        { smiley:'🧛‍♂️', score: 1 },
        { smiley:'🧟‍♀️', score: -2},
        { smiley:'🧟‍♂️', score: -2},
        { smiley:'🧞‍♀️', score: 1},
        { smiley:'🧞‍♂️', score: 1},
        { smiley:'🧜‍♀️', score: 1},
        { smiley:'🧜‍♂️', score: 1},
        { smiley:'🧚‍♀️', score: 1},
        { smiley:'🧚‍♂️', score: 1},
        { smiley:'🧙‍♀️', score: 1},
        // Ajoutez les autres 197 émoticônes avec leurs scores de sentiment ici
      ];

      for (const emoticon of emoticons) {
        await insertDB(emoticon);
    }
    console.log('Nouvelle ligne insérée avec succès pour les emot.');
} 

async function insertDB(emoticones) {
    let insertQuery;
    insertQuery = `
        INSERT INTO emoticones (smiley, score)
        VALUES ($1, $2) RETURNING Id
    `;
    try {
        const res = await client.query(insertQuery, [emoticones.smiley, emoticones.score]);
    } catch (err) {
        console.error('Erreur lors de l\'insertion d\'une nouvelle ligne:', err.message);
    }
}

EmoticoneAdd();

const deleteQuery = `DELETE  FROM profil`;
client.query(deleteQuery);
const delete2Query = `DELETE  FROM profildetail`;
client.query(delete2Query);
const delete3Query = `DELETE  FROM comments`;
client.query(delete3Query);

// Exporte le client PostgreSQL
module.exports = client;