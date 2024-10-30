// db.js
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'express', // Nom de la base de données par défaut
});

db.connect((err) => {
    if (err) {
        console.error('Échec de la connexion à la base de données:', err.stack);
        return;
    }
    console.log('Connecté à la base de données');
});

module.exports = db;
