# Web Crawler

Le projet était un projet à réalisé en groupe de 3, son but était de faire un crawler qui 
récupère des informations sur différent sites web, nous avons choisis de faire un crawler qui 
récupère des informations sur 2 sites de ventes (Aliexpress, Amazon) afin de faire une 
comparaison de pris ainsi qu'un crawler qui récupère des infos
sur instagram qui possède plusieurs fonctionnalités

## Sommaire
1. __[Requis](#requis)__
2. __[Lancer le serveur](#lancerserveur)__
3. __[Fonctionnalités Crawlers](#fonctionnalité)__
4. __[Auteurs](#auteurs)__

<div id = "requis" />

## Requis

- Axios
- CORS
- PG
- Puppeteer
- body-parser
- sentiment
- Express

Installer tous les paquets : ```npm i axios cors pg puppeteer body-parser sentiment express```

<div id = "lancerserveur" />

## Lancer le serveur
``node back/server.js``

<div id = "fonctionnalité" />

## Fonctionnalités Crawlers

| Crawler Site de vente                  |                            Crawler Réseaux Sociaux                            |
|:---------------------------------------|:-----------------------------------------------------------------------------:|
| Chercher un article                    | Analyser les sentiments <br/>des commentaires des premiers posts d'un profil  |
| Se déplace sur 2 sites web             |                  Like/Unlike un ou plusieurs post instagram                   |
| Récupère les informations de l'article |     Afficher un profil instagram                                              |
|                                        |                   Follow/Unfollow un ou plusieurs profil(s)                   |
  |                                      |                                   Ecrire un commentaire sur un post                                             |
  |                                       |  Afficher un profil instagram                                                 |

<div id = "auteurs" />

## Auteurs

- Florian Boulbes
- Sebastien Thollard
- Maxime Poiret