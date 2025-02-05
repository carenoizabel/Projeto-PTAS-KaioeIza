const express = require('express');
const router = express.Router();

const PerfilController = require('../controllers/PerfilController');

router.get("/", PerfilController.getPerfil);

router.put("/", PerfilController.atualizarPerfil);

// / perfil/atlualizar
// / perfil/buscar


//POST E GET
//PUT, PATCH, DELETE

module.exports = router;