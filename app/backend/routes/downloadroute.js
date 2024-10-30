const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

router.get("/download/:transferId", (req, res) => {
  const transferId = req.params.transferId;const express = require("express");
  const path = require("path");
  const fs = require("fs");
  
  const router = express.Router();
  
  router.get("/download/:transferId", (req, res) => {
    const transferId = req.params.transferId;
    // Recherche du fichierpar transferId
    const file = fs.readdirSync(path.join(__dirname, "../uploads")).find(f => f.startsWith(transferId));
    
    if (file) {
      const filePath = path.join(__dirname, "../uploads", file);
      res.download(filePath, (err) => {
        if (err) {
          res.status(500).send("Erreur lors du téléchargement du fichier.");
        }
      });
    } else {
      res.status(404).send("Fichier introuvable.");
    }
  });
  
  module.exports = router;
  // Recherche du fichierpar transferId
  const file = fs.readdirSync(path.join(__dirname, "../uploads")).find(f => f.startsWith(transferId));
  
  if (file) {
    const filePath = path.join(__dirname, "../uploads", file);
    res.download(filePath, (err) => {
      if (err) {
        res.status(500).send("Erreur lors du téléchargement du fichier.");
      }
    });
  } else {
    res.status(404).send("Fichier introuvable.");
  }
});

module.exports = router;

