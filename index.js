const prisma = require("./prisma/prismaClient");

const cors = require("cors");
 
const express = require('express');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true}));

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

app.listen(8000);