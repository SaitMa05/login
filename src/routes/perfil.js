const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/PerfilController');

router.get('/perfil', perfilController.perfil);

module.exports = router;