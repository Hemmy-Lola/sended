const express = require("express");
const multer = require("multer");
const fs = require("fs");

const router = express.Router();
const MAX_SIZE = 2 * 1024 * 1024 * 1024; // 2 Go

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
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

router.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).send("Le fichier dépasse la limite de 2 Go.");
      }
      return res.status(500).send("Erreur lors du téléchargement.");
    }

    // Enregistrer le chemin du fichier et générer un ID de transfert
    req.file.transferId = req.file.filename.split('-')[0];
    
    // Réponse avec le transfert ID
    res.status(200).json({ 
      message: "Fichier téléchargé avec succès.", 
      transferId: req.file.transferId
    });
  });
});

module.exports = router;