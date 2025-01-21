const express = require('express');
const router = express.Router();

const MesaContoller = require('../controllers/MesaController');
const AuthController = require('../controllers/AuthController');

router.post(
    '/novo', 
    AuthController.autenticar,
     AuthController.verificaPermissaoAdm, 
     MesaContoller.novaMesa
    );

    //route.get("/", MesaContoller.buscarMesas);

module.exports = router;