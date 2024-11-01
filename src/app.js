const express = require('express');
const {engine} = require('express-handlebars');
const myConnection = require('express-myconnection');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');

const perfilRoutes = require('./routes/perfil');

const loginRoutes = require('./routes/login');
const emailRoutes = require('./routes/email');



const app = express();
app.set('port', 4000);


app.use(express.static('css'));
app.use(express.static('icons'));
app.use(express.static('js'));
app.use(express.static('alert'));
app.use(express.static('img'));


app.set('views', __dirname + '/views');
app.engine('.hbs', engine({
    extname: '.hbs',
}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(myConnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'sopadeletras'
}));


app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.listen(app.get('port'), () => {
    console.log('Servidor en puerto', app.get('port'));
});


app.use('/', loginRoutes);
app.use('/email', emailRoutes);
app.use('/', perfilRoutes);


app.get('/', (req, res) => {
    if(req.session.loggedin) {
        res.render('home', {username: req.session.username, loggedin: req.session.loggedin, imgPerfil: req.session.imgPerfil});
    }else{
        res.redirect('/login');
    }
});