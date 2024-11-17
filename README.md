# Sended!
**Importe, envoie, télécharge et vice versa !**

## Contexte du projet
Dans le cadre de notre module de node.js, il nous a été demandé de mettre en place une application similaire à wetransfer, permettant ainsi a des utilisateurs d'importer des fichiers sur la plateforme et le partager à n'importe qui. 

## Notre équipe est composé de... 
- **Meryem EL FELLOUSSI** : Chargée de la création de la base de données et de la gestion de l'authentification des utilisateurs 
- **Sira KALLOGA** - Chargée du système de téléchargement des fichiers et de la génération de liens 
- **Hemmy-Lola MATHYS** - Chargée de la conteneurisation

## Installation et lancement

### Option 1 : Utilisation avec Docker 

1. Assurez-vous d'avoir Docker et Docker Compose installés.
2. Lancez les conteneurs :
    ```bash
    docker-compose up --build
    ```
3. Accédez à l'application via `http://localhost:3006`.
4. Authentification : 
- Si vous souhaitez vous connecter à un user déjà renseigné dans la bdd : 
- mail : jeanfrancois@user.com 
- password : anotherpassword

### En cas de problème avec l'authentification qui ne fonctionne pas 
Si le système d'authentification ne fonctionne pas avec la version actuelle, utilisez une image Docker correspondant à un push fonctionnel :
```bash
ecfb5f914fcce44784c56422b03abf663cffa21a
```
Celui ci regroupe la dockerisation et la logique de l'application sans système d'authentification

### Option 2 : Si la dockerisation ne fonctionne pas correctement

Installez les dépendances :
```bash
npm install
```
Démarrez l'application :
```bash
npm start
```
Accédez à l'application via http://localhost:3006.


## Technologies utilisées
- **Langages :** Typescript, HTML, CSS
- **Frameworks :** Node.js et Express pour le Back-End
- **Base de données :** MySQL
- **Containerisation :** Docker

## Axes d'amélioration
Bien que notre application soit fonctionnelle, plusieurs améliorations auraient pu ou pourraient être apportées pour une version future :

- **Fiabilité du système d'authentification :** Effectuer des tests approfondis et corriger les éventuels problèmes pour garantir une authentification sécurisée et robuste.
- **Connexion à la base de données via Docker :** Optimiser et tester correctement l'intégration avec la base de données pour une configuration simplifiée et fiable en conteneurisé.
- **Affichage du stockage utilisé :** Ajouter une fonctionnalité permettant à l'utilisateur de visualiser l'espace de stockage utilisé pour une meilleure gestion de ses fichiers.
- **Moyens de partage :** Intégrer différentes options pour partager les fichiers.
- **Amélioration de l'interface utilisateur :** Apporter une meilleure interface pour rendre l'expérience utilisateur plus intuitive et agréable.
