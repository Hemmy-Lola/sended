"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const db_1 = __importDefault(require("./db"));
const app = (0, express_1.default)();
const PORT = 3006;
//app.get('/', (req, res) => {
//res.send('Bienvenue sur le serveur !');
//});
// Middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api", routes_1.default);
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.use(express_1.default.static(path_1.default.join(__dirname, 'Frontend')));
app.use(express_1.default.urlencoded({ extended: true }));
db_1.default.connect(err => {
    if (err) {
        console.error("Échec de la connexion à la base de données:", err.stack);
        process.exit(1); // Arrête l'application si la connexion échoue
    }
    console.log("Connecté à la base de données");
});
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
exports.default = app;
