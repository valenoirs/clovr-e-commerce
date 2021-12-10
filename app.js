const express = require('express');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');

const MongoStore = require('connect-mongo');

const methodOverride = require('method-override');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(session({
    secret: 'valenoirs',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.DB_STRING,
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use((req, res, next) => {
    if(req.session.userId){
        res.locals.userId = req.session.userId;
        res.locals.no_meja = req.session.no_meja;
    }

    next();
});

app.use((req, res, next) => {
    if(req.session.adminId){
        res.locals.adminId = req.session.adminId;
    }

    next();
})

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(expressLayouts);
app.use(methodOverride('_method'));

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.use(express.static('public'));

mongoose.connect(process.env.DB_STRING)
.then(() => console.log(`connected to ${process.env.DB_STRING}`))
.catch((error) => console.log(error));

app.use('/admin', require('./routes/admin'));
app.use('/', require('./routes/user'));

app.get('/ping', (req, res, next) => {
    res.send('<h1>Putang ina mo bobo talaga gago!<h1><br><h1>Sekarang server sementara berjalan!<h1><br><h1>Now the server is running!<h1>');
});

app.listen(PORT, () => {console.log(`Server Runnning at port ${PORT}`)});