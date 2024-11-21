import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import routes from "./routes";
import db from "./db";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { RowDataPacket } from 'mysql2';

dotenv.config();

const app = express();
const PORT = 3006;

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api", routes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.static(path.join(__dirname, 'Frontend')));
app.use(express.urlencoded({ extended: true }));

// Connexion à la base de données
db.connect(err => {
    if (err) {
        console.error("Échec de la connexion à la base de données:", err.stack);
        process.exit(1);
    }
    console.log("Connecté à la base de données");
});

// Route d'inscription
app.post('/api/register', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO users (mail, password) VALUES (?, ?)";
    db.query(query, [email, hashedPassword], (error) => {
        if (error) {
            return res.status(500).json({ message: "Erreur lors de l'inscription." });
        }
        res.status(201).json({ message: "Inscription réussie !" });
    });
});

// Route de connexion
app.post('/api/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM users WHERE mail = ?";
    db.query<RowDataPacket[]>(query, [email], async (error, results) => {
        if (error || results.length === 0) {
            return res.status(401).json({ message: "Identifiants invalides." });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Identifiants invalides." });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("La variable d'environnement JWT_SECRET n'est pas définie");
        }

        const token = jwt.sign({ id: user.ID, email: user.mail }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});

export default app;
