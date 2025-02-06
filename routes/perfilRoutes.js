const express = require('express');
const router = express.Router();

const PerfilController = require('../controllers/PerfilController');

router.get("/", PerfilController.getPerfil);

router.put("/", PerfilController.atualizarPerfil);



module.exports = router;