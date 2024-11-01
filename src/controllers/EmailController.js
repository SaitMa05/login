const nodemailer = require('nodemailer');

// Configuración del transporte
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pruebanodejss@gmail.com', // tu correo
        pass: 'dvgr iqsq skxl gwov',        // tu contraseña de aplicación
    },
});

// Función para enviar el correo de verificación
exports.sendVerificationEmail = (email,token, callback) => {
    // Opciones del correo
    let mailOptions = {
        from: 'pruebanodejss@gmail.com',
        to: email,
        subject: 'Token de verificación',
        text: 'Verificación de correo electrónico',
        html: `<p>${token}</p>`, // opcional
    };

    // Enviar el correo
    transporter.sendMail(mailOptions, callback);
};
