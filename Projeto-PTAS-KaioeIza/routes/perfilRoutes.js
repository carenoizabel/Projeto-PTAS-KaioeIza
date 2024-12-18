const express = require('express');
const router = express.Router();

const profileRoutes = require('../controllers/PerfilController');

router.get("/", PerfilController.getPerfil);

router.put("/", PerfilController.atualizaPerfil);

// / perfil/atlualizar
// / perfil/buscar


//POST E GET
//PUT, PATCH, DELETE

module.exports = router;