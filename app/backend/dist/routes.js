"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
const MAX_SIZE = 2 * 1024 * 1024 * 1024; // Limite de 2 Go
// Vérifiez ou créez le dossier "uploads"
const uploadDir = path_1.default.join(__dirname, "../uploads");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir);
}
// Configuration de multer pour le stockage
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
console.log("Requête reçue sur /api/uploads");
router.post("/uploads", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error("Erreur Multer :", err);
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({ message: "Le fichier dépasse la limite de 2 Go." });
            }
            return res.status(500).json({ message: "Erreur lors du téléchargement." });
        }
        console.log("Requête reçue pour l'upload...");
        if (!req.file) {
            return res.status(400).json({ message: "Aucun fichier n'a été téléchargé." });
        }
        const transferId = req.file.filename.split("-")[0];
        const downloadLink = `${req.protocol}://${req.get("host")}/api/download/${transferId}`;
        res.status(200).json({
            message: "Fichier téléchargé avec succès.",
            transferId,
            downloadLink,
        });
    });
});
// Route pour générer un lien de transfert
router.get("/transfer/:transferId", (req, res) => {
    const { transferId } = req.params;
    const downloadLink = `${req.protocol}://${req.get("host")}/api/download/${transferId}`;
    res.status(200).json({
        message: "Lien de téléchargement généré avec succès.",
        downloadLink,
    });
});
// Route pour le téléchargement de fichier via le lien généré
router.get("/download/:transferId", (req, res) => {
    const { transferId } = req.params;
    const file = fs_1.default
        .readdirSync(uploadDir)
        .find((f) => f.startsWith(transferId));
    if (file) {
        const filePath = path_1.default.join(uploadDir, file);
        res.download(filePath, (err) => {
            if (err) {
                res.status(500).json({ message: "Erreur lors du téléchargement du fichier." });
            }
        });
    }
    else {
        res.status(404).json({ message: "Fichier introuvable." });
    }
});
exports.default = router;
