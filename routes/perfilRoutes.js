const express = require('express');
const router = express.Router();

const PerfilController = require('../controllers/PerfilController');

router.get("/", PerfilController.getPerfil);

router.put("/", PerfilController.atualizarPerfil);

// / perfil/atlualizar
router.get('/', PerfilController.getPerfil);

// / perfil/buscar
router.get('/buscar', PerfilController.buscarPerfil);

//PUT, PATCH, DELETE
router.patch('/', PerfilController.atualizarParcialPerfil);

router.delete('/', PerfilController.deletarPerfil);

module.exports = router;