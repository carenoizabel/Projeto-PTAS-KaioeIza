const express = require('express');
const router = express.Router();

const ReservaContoller = require('../controllers/ReservaContoller');
const AuthController = require('../controllers/AuthController');

router.post("/novo", ReservaContoller.registrarReserva);

module.exports = router;