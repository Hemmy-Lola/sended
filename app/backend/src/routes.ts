import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { createSharedLink } from './sharedlinks';
import db from './db';

const router = express.Router();
const MAX_SIZE = 2 * 1024 * 1024 * 1024; 

// Créez le dossier "uploads" s'il n'existe pas
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: MAX_SIZE },
}).single("file");

// Interface personnalisée pour la requête avec Multer
//interface CustomRequest extends Request {
   // file: Express.Multer.File;

interface User {
      ID: number;
  }

// Route pour l'upload de fichiers
router.post("/uploads", (req: Request, res: Response) => {
  upload(req, res, (err: any) => {
      if (err) {
          return res.status(500).json({ message: "Erreur lors du téléchargement." });
      }

      if (!req.file) {
          return res.status(400).json({ message: "Aucun fichier n'a été téléchargé." });
      }

      const { file } = req; 
      const { senderEmail } = req.body; 

      // Rechercher l'utilisateur par email
      const queryUser = "SELECT ID FROM users WHERE mail = ?";
      db.query(queryUser, [senderEmail], (error: any, results: any) => {
          if (error) {
              console.error("Erreur lors de la recherche de l'utilisateur:", error);
              return res.status(500).json({ message: "Erreur lors de la recherche de l'utilisateur." });
          }

          if (results.length === 0) {
              // Créer un nouvel utilisateur si l'email n'existe pas
              const newUserQuery = "INSERT INTO users (mail) VALUES (?)"; 
              db.query(newUserQuery, [senderEmail], (insertError: any) => {
                  if (insertError) {
                      console.error("Erreur lors de la création d'un nouvel utilisateur:", insertError);
                      return res.status(500).json({ message: "Erreur lors de la création de l'utilisateur." });
                  }

                  // Récupérer l'ID du nouvel utilisateur
                  retrieveUserId(senderEmail, res, file);
              });
          } else {
              const userId = results[0].ID; 
              insertFileToDatabase(userId, file, res);
          }
      });
  });
});

// Fonction pour récupérer l'ID de l'utilisateur 
const retrieveUserId = (email: string, res: Response, file: Express.Multer.File) => {
  const userIdQuery = "SELECT ID FROM users WHERE mail = ?";
  db.query(userIdQuery, [email], (selectError: any, selectResults: any) => {
      if (selectError) {
          console.error("Erreur lors de la récupération de l'ID de l'utilisateur:", selectError);
          return res.status(500).json({ message: "Erreur lors de la récupération de l'ID de l'utilisateur." });
      }

      if (selectResults.length > 0) {
          const userId = selectResults[0].ID; 
          insertFileToDatabase(userId, file, res);
      } else {
          res.status(404).json({ message: "Utilisateur nouvellement créé introuvable." });
      }
  });
};

// Fonction pour insérer le fichier dans la base de données
const insertFileToDatabase = (userId: number, file: Express.Multer.File, res: Response) => {
  const fileQuery = "INSERT INTO fichiers (id_user, fichier_name, fichier_size, link_fichier) VALUES (?, ?, ?, ?)";
  const linkFichier = `http://localhost:3006/api/download/${file.filename}`; 

  db.query(fileQuery, [userId, file.filename, file.size, linkFichier], (insertError: any) => {
      if (insertError) {
          console.error("Erreur lors de l'insertion du fichier:", insertError);
          return res.status(500).json({ message: "Erreur lors de l'insertion du fichier." });
      }
      res.status(200).json({ message: "Fichier téléchargé et enregistré avec succès.", linkFichier });
  });
};

// Route pour partager le lien
router.post('/share-link', createSharedLink);

// Route pour supprimer le fichier
router.delete('/files/:filename', (req: Request, res: Response) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Erreur lors de la suppression du fichier:', err);
            return res.status(404).json({ message: 'Fichier non trouvé.' });
        }
        res.status(200).json({ message: `Fichier '${filename}' supprimé avec succès.` });
    });
});

// Route pour récupérer tous les fichiers
router.get('/files', (req: Request, res: Response) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error('Erreur lors de la lecture du dossier:', err);
            return res.status(500).json({ message: 'Erreur interne du serveur' });
        }
        res.status(200).json({ files });
    });
});

export default router;
