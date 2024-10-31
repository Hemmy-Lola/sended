import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import routes from "./routes"

const app = express();
const PORT = 3006;

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api", routes);
app.use(express.urlencoded({ extended: true }));

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
