const express = require('express');
const router = express.Router();
const emailSends = require('../controllers/EmailController');

router.post('/register', (req, res) => {
    const { email } = req.body;
    emailSends.sendVerificationEmail(email, (error, info) => {
        if (error) {
            console.log('Error al enviar el correo:', error);
            return res.status(500).send('Error al enviar el correo electrónico.');
        }
        console.log('Correo enviado:', info.response);
        res.status(200).send('Correo enviado correctamente.');
    });
});

module.exports = router;
