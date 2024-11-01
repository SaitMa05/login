function perfil(req, res) {
    if (!req.session.loggedin) return res.redirect('/');
    res.render('perfil/perfil', { username: req.session.username, imgPerfil: req.session.imgPerfil, loggedin: req.session.loggedin});
}

module.exports = {
    perfil
};