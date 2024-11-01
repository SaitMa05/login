const bcrypt = require('bcrypt');
const { use } = require('../routes/login');
const emailSends = require('./EmailController');



function login(req, res) {
    if(req.session.loggedin) return res.redirect('/');
    res.render('login/index')
}
function register(req, res) {
    if(req.session.loggedin) return res.redirect('/');
    res.render('login/register');
}
function token(req, res) {
    if(!req.session.email) return res.redirect('/register');
    res.render('login/token');
}


function tokenVerify(req, res){
    const data = req.body;
    const {token} = data;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM user WHERE email = ?', [req.session.email], (error, userdata) => {
            if(userdata[0].token == token){
                conn.query('UPDATE user SET verificacion = 1 WHERE email = ?', [req.session.email], (error, userdata) => {
                    conn.query('UPDATE user SET token = null WHERE email = ?', [req.session.email], (error, userdata) => {
                        res.redirect('/login');
                    });
                });
            }else{
                res.render('login/token', {error: 'Token incorrecto'});
            }
        }
    )}
    )
}


function authenticateUser(req, res) {
    const data = req.body;
    const {email, password} = data;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM user WHERE email = ?', [email], (error, userdata) => {
            if(userdata[0].verificacion === 0){
                return res.render('login/index', {error: 'Verifica tu correo electrónico para poder continuar'});
            }else{
                if(userdata.length > 0) {
                    bcrypt.compare(password, userdata[0].password).then((result) => {
                        if(result) {
                            req.session.loggedin = true;
                            req.session.email = email;
                            req.session.username = userdata[0].username;
                            req.session.imgPerfil = userdata[0].imgPerfil;
                            res.redirect('/');
                        }else{
                            res.render('login/index', {error: 'Usuario o contraseña incorrecta'});
                        }
                    });
                }else{
                    res.render('login/index', {error: 'Usuario o contraseña incorrecta'});
                }
            }
        });
    });

}


function storeUser(req, res) {
    const { username, email, password } = req.body;
    let token = Math.floor(Math.random() * 1000000);
    if(token.length < 6){
        token = token * 100;
    }
    // Validar datos recibidos...

    req.getConnection((err, conn) => {
        if (err) return res.status(500).send('Error en el servidor.');

        // Verificar si el usuario o email ya existen...
        conn.query('SELECT * FROM user WHERE email = ? OR username = ?', [email, username], (err, userdata) => {
            if (userdata.length > 0) {
                let usernameDB = userdata[0].username;
                
                // Usuario o email ya existen...
                if(userdata[0].username == username){
                    return res.render('login/register', { error: 'El Usuario ya existe.',emailValue: email, usernameValue: username});
                }
                if(userdata[0].email == email){
                    return res.render('login/register', { error: 'El Email ya existe.', emailValue: email, usernameValue: username });
                }
                // if(userdata[0].username == username && userdata.email == email){
                //     return res.render('login/register', { error: 'El Usuario y Email ya existen.', emailValue: email, usernameValue: username });
                // }
                if(usernameDB.length > 46){
                    return res.render('login/register', { error: 'No se puede colocar un nombre tan largo', emailValue: email, usernameValue: username });
                }
            } else {
                // Hashear contraseña...
                bcrypt.hash(password, 10).then((hash) => {
                    // Insertar usuario en la base de datos...
                    conn.query('INSERT INTO user SET ?', { username, email, password: hash, imgPerfil: "images.jpg", token: token, verificacion: 0}, (err) => {
                        if (err) return res.status(500).send('Error al insertar usuario.');

                        // Enviar correo de verificación...
                        emailSends.sendVerificationEmail(email, token ,(error, info) => {
                            if (error) {
                                // Manejar error al enviar correo...
                                return res.status(500).send('Error al enviar el correo electrónico.');
                            }
                            req.session.email = email;
                            // Redirigir o informar al usuario que se ha registrado correctamente...
                            res.redirect('/token');
                        });
                    });
                }).catch((err) => {
                    // Error al hashear contraseña...
                    return res.status(500).send('Error en el servidor.');
                });
            }
        });
    });
}


function logout(req, res) {
    if(req.session.loggedin == true) {
        req.session.destroy(() => {
            res.redirect('/login');
        }); 
    }else{
        return res.redirect('/login');
    }
}


module.exports = {
    login,
    register,
    token,
    storeUser,
    authenticateUser,
    tokenVerify,
    logout
}