
import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import routes from "./routes"
import db from "./db"; 

const app = express();
const PORT = 3006;

//app.get('/', (req, res) => {
  //res.send('Bienvenue sur le serveur !');
//});

// Middlewares
app.use(express.json());
app.use(cors());
app.use("/api", routes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.static(path.join(__dirname, 'Frontend')));
app.use(express.urlencoded({ extended: true }));

db.connect(err => {
  if (err) {
      console.error("Échec de la connexion à la base de données:", err.stack);
      process.exit(1);  // Arrête l'application si la connexion échoue
  }
  console.log("Connecté à la base de données");

});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});

export default app;