import { Request, Response } from 'express';
import db from './db'; 

export const createSharedLink = (req: Request, res: Response) => {
    const { fichier_id, shared_link, expiration_date } = req.body;

    const query = 'INSERT INTO shared_links (fichier_id, shared_link, expiration_date) VALUES (?, ?, ?)';
    db.query(query, [fichier_id, shared_link, expiration_date], (error) => {
        if (error) {
            console.error('Erreur lors de la création du lien partagé:', error);
            return res.status(500).json({ message: "Erreur lors de la création du lien partagé." });
        }
        res.status(200).json({ message: "Lien partagé créé avec succès." });
    });
};
