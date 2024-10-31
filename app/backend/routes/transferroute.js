const express = require("express");

const router = express.Router();

router.get("/transfer/:transferId", (req, res) => {
    
  const { transferId } = req.params;
  const fileUrl = `${req.protocol}://${req.get("host")}/download/${transferId}`;
  
  //res.status(200).json({
   // message: "Lien de téléchargement généré avec succès.",
    //fileUrl,
    res.send("Lien de transfert généré.");  
  });


module.exports = router;
