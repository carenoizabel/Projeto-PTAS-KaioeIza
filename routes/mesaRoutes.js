const express = require('express');
const router = express.Router();

const MesaController = require('../controllers/MesaController');
const AuthController = require('../controllers/AuthController');

router.post(
    '/novo', 
    AuthController.autenticar,
     AuthController.verificaPermissaoAdm, 
     MesaController.novaMesa
    );

    router.get("/", MesaController.getMesas);

module.exports = router;