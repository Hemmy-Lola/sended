import mysql from "mysql2";
import { config } from "dotenv";
config();

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST, 
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE_NAME,
    port: process.env.MYSQL_PORT,
    password: process.env.MYSQL_ROOT_PASSWORD
});



db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.stack);
        return;
    }
    console.log("Connected to the database.");

    
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS Users (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            firstname VARCHAR(50) NOT NULL,
            lastname VARCHAR(50) NOT NULL,
            mail VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            list_fichiers TEXT
        );
    `;

    
    const createFichiersTable = `
        CREATE TABLE IF NOT EXISTS Fichiers (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            id_user INT NOT NULL,
            fichier_name VARCHAR(255) NOT NULL,
            date_add DATETIME DEFAULT CURRENT_TIMESTAMP,
            date_supp DATETIME,
            link_fichier VARCHAR(255) NOT NULL,
            FOREIGN KEY (id_user) REFERENCES Users(ID) ON DELETE CASCADE
        );
    `;

   
    db.query(createUsersTable, (err, result) => {
        if (err) {
            console.error("Error creating Users table:", err);
            return;
        }
        console.log("Users table checked/created successfully.");
    });

    
    db.query(createFichiersTable, (err, result) => {
        if (err) {
            console.error("Error creating Fichiers table:", err);
            return;
        }
        console.log("Fichiers table checked/created successfully.");
    });
});

export default db;
