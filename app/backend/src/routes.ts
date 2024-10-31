import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();
const MAX_SIZE = 2 * 1024 * 1024 * 1024; // Limite de 2 Go

// Vérifiez ou créez le dossier "uploads"
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuration de multer pour le stockage
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


 interface CustomRequest extends Request {
    file: Express.Multer.File;
 }
// console.log("Requête reçue sur /api/uploads");

router.post("/uploads", (req: Request, res: Response) => {
  upload(req, res, (err: any) => {
    if (err) {
      console.error("Erreur Multer :", err);
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "Le fichier dépasse la limite de 2 Go." });
      }
      return res.status(500).json({ message: "Erreur lors du téléchargement." });
    }
    //console.log("Requête reçue pour l'upload...");

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
router.get("/transfer/:transferId", (req: Request, res: Response) => {
  const { transferId } = req.params;
  const downloadLink = `${req.protocol}://${req.get("host")}/api/download/${transferId}`;

  res.status(200).json({
    message: "Lien de téléchargement généré avec succès.",
    downloadLink,
  });
});

// Route pour le téléchargement de fichier via le lien généré
router.get("/download/:transferId", (req: Request, res: Response) => {
  const { transferId } = req.params;
  const file = fs
    .readdirSync(uploadDir)
    .find((f) => f.startsWith(transferId));

  if (file) {
    const filePath = path.join(uploadDir, file);
    res.download(filePath, (err) => {
      if (err) {
        res.status(500).json({ message: "Erreur lors du téléchargement du fichier." });
      }
    });
  } else {
    res.status(404).json({ message: "Fichier introuvable." });
  }
});

export default router;
