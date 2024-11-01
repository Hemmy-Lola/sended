import express from "express";
import { config } from "dotenv"
import mysql from "mysql2"
import path from "path"
import { fileURLToPath } from 'url';
import hbs from "hbs"
import pageRouter from "./routes/pages.js"
import authRouter from "./routes/auth.js"
import session from 'express-session';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log(__dirname)

config();

const app = express();



// console.log(process.env.MYSQL_HOST);


// const db = mysql.createConnection({
//     host:process.env.MYSQL_HOST,
//     user:process.env.MYSQL_USER,
//     database:process.env.MYSQL_DATABASE_NAME,
//     port : process.env.MYSQL_PORT,
//     password:process.env.MYSQL_ROOT_PASSWORD
// });

const publicDirectory = path.join(__dirname , './public')
app.use(express.static(publicDirectory))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.set('view engine' , 'hbs');
app.use(session({
    secret: 'your_secret_key',         // Replace with a strong secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }           // Set to true if using HTTPS
}));
// db.connect((error) => {
//     if(error)console.log(error);
//     else console.log("my sql connected ...");
    
// })

const PORT = process.env.PORT;

app.use("/" , pageRouter);
app.use("/auth" , authRouter )


app.listen(PORT , () => {
    console.log("connected to port " , PORT);
})

