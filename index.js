const prisma = require("./prisma/prismaClient");

const cors = require("cors");

const express = require('express');

const AuthController = require("./controllers/AuthController");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true}));

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const perfilRoutes = require ("./routes/perfilRoutes");
app.use("/perfil", AuthController.autenticar, perfilRoutes);


app.listen(8000, () =>{
    console.log("Servidor rodando na porta 8000.");
});