const express = require("express");
const uploadroute = require("./routes/uploadroute");
const transferroute = require("./routes/transferroute");
const downloadroute = require("./routes/downloadroute");


const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route pour la racine
app.get("/", (req, res) => {
    res.send("Bienvenue sur le serveur de transfert de fichiers!");
  });

// Routes
app.use("/", uploadroute);
app.use("/", downloadroute);
app.use("/", transferroute);

// Serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });

  console.log(uploadroute);
  console.log(transferroute);
  console.log(downloadroute);
  