const express = require('express');
const router = express.Router();

const ReservaController = require('../controllers/ReservaController');
const AuthController = require('../controllers/AuthController');

router.post("/novo", ReservaController.registrarReservas);

router.post("/", AuthController.verificaPermissaoAdm, AuthController.autenticar, ReservaController.verMinhasReservas);

module.exports = router;