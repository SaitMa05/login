const express = require('express');
const LoginController = require('../controllers/LoginController');

const router = express.Router();

router.get('/login', LoginController.login);
router.get('/register', LoginController.register);
router.get('/token', LoginController.token);
router.post('/register', LoginController.storeUser);
router.post('/login', LoginController.authenticateUser);
router.post('/token', LoginController.tokenVerify);
router.get('/logout', LoginController.logout);


module.exports = router;