"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sharedlinks_1 = require("./sharedlinks");
const db_1 = __importDefault(require("./db"));
const router = express_1.default.Router();
const MAX_SIZE = 2 * 1024 * 1024 * 1024; // Taille maximale du fichier
// Créez le dossier "uploads" s'il n'existe pas
const uploadDir = path_1.default.join(__dirname, "../uploads");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir);
}
// Configuration de multer pour le stockage des fichiers
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: MAX_SIZE },
}).single("file");
// Route pour l'upload de fichiers
router.post("/uploads", (req, res) => {
    upload(req, res, (err) => {
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
        db_1.default.query(queryUser, [senderEmail], (error, results) => {
            if (error) {
                console.error("Erreur lors de la recherche de l'utilisateur:", error);
                return res.status(500).json({ message: "Erreur lors de la recherche de l'utilisateur." });
            }
            if (results.length === 0) {
                // Créer un nouvel utilisateur si l'email n'existe pas
                const newUserQuery = "INSERT INTO users (mail) VALUES (?)";
                db_1.default.query(newUserQuery, [senderEmail], (insertError) => {
                    if (insertError) {
                        console.error("Erreur lors de la création d'un nouvel utilisateur:", insertError);
                        return res.status(500).json({ message: "Erreur lors de la création de l'utilisateur." });
                    }
                    // Récupérer l'ID du nouvel utilisateur
                    retrieveUserId(senderEmail, res, file);
                });
            }
            else {
                const userId = results[0].ID;
                insertFileToDatabase(userId, file, res);
            }
        });
    });
});
// Fonction pour récupérer l'ID de l'utilisateur 
const retrieveUserId = (email, res, file) => {
    const userIdQuery = "SELECT ID FROM users WHERE mail = ?";
    db_1.default.query(userIdQuery, [email], (selectError, selectResults) => {
        if (selectError) {
            console.error("Erreur lors de la récupération de l'ID de l'utilisateur:", selectError);
            return res.status(500).json({ message: "Erreur lors de la récupération de l'ID de l'utilisateur." });
        }
        if (selectResults.length > 0) {
            const userId = selectResults[0].ID;
            insertFileToDatabase(userId, file, res);
        }
        else {
            res.status(404).json({ message: "Utilisateur nouvellement créé introuvable." });
        }
    });
};
// Fonction pour insérer le fichier dans la base de données
const insertFileToDatabase = (userId, file, res) => {
    const fileQuery = "INSERT INTO fichiers (id_user, fichier_name, fichier_size, link_fichier) VALUES (?, ?, ?, ?)";
    const linkFichier = `http://localhost:3006/api/download/${file.filename}`; // Lien de téléchargement
    db_1.default.query(fileQuery, [userId, file.filename, file.size, linkFichier], (insertError) => {
        if (insertError) {
            console.error("Erreur lors de l'insertion du fichier:", insertError);
            return res.status(500).json({ message: "Erreur lors de l'insertion du fichier." });
        }
        res.status(200).json({ message: "Fichier téléchargé et enregistré avec succès.", linkFichier });
    });
};
// Route pour partager le lien
router.post('/share-link', sharedlinks_1.createSharedLink);
// Route pour supprimer le fichier
router.delete('/files/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path_1.default.join(uploadDir, filename);
    fs_1.default.unlink(filePath, (err) => {
        if (err) {
            console.error('Erreur lors de la suppression du fichier:', err);
            return res.status(404).json({ message: 'Fichier non trouvé.' });
        }
        res.status(200).json({ message: `Fichier '${filename}' supprimé avec succès.` });
    });
});
// Route pour récupérer tous les fichiers
router.get('/files', (req, res) => {
    fs_1.default.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error('Erreur lors de la lecture du dossier:', err);
            return res.status(500).json({ message: 'Erreur interne du serveur' });
        }
        res.status(200).json({ files });
    });
});
exports.default = router;
