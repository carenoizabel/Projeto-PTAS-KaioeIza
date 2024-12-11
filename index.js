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

app.use("/perfil", AuthController.verificaAutenticacao, perfilRoutes);
app.get("/privado", AuthController.verificaAutenticacao, (req, res) => {
    res.json({
        msg: "Você acessou uma rota restrita!"
    })
})

app.listen(8000);