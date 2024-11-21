"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSharedLink = void 0;
const db_1 = __importDefault(require("./db"));
const createSharedLink = (req, res) => {
    const { fichier_id, shared_link, expiration_date } = req.body;
    const query = 'INSERT INTO shared_links (fichier_id, shared_link, expiration_date) VALUES (?, ?, ?)';
    db_1.default.query(query, [fichier_id, shared_link, expiration_date], (error) => {
        if (error) {
            console.error('Erreur lors de la création du lien partagé:', error);
            return res.status(500).json({ message: "Erreur lors de la création du lien partagé." });
        }
        res.status(200).json({ message: "Lien partagé créé avec succès." });
    });
};
exports.createSharedLink = createSharedLink;
