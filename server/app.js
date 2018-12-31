//////////////////////////////////////////////////
//            getting moodules
/////////////////////////////////////////////////
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const conn = require('./config/index')
const flash = require('express-flash-messages')
const session = require('express-session')
const expressValidator = require('express-validator')
const cookieParser = require('cookie-parser')
const passport = require('passport')

//////////////////////////////////////////////////
//          app
/////////////////////////////////////////////////
var app = express();

//////////////////////////////////////////////////
//            connect to database
/////////////////////////////////////////////////
mongoose.connect(conn.mongodb, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB Connected')
    })
    .catch(err => {
        console.log('Error:' + err)
    })

//////////////////////////////////////////////////
//            view engine
/////////////////////////////////////////////////
app.set('view engine', 'ejs');

//////////////////////////////////////////////////
//            middleware
/////////////////////////////////////////////////
//  Logger
app.use(morgan('dev', {
    skip: (req, res) => {
        return res.statusCode < 400
    },
    stream: process.stderr
}));

app.use(morgan('dev', {
    skip: (req, res) => {
        return res.statusCode >= 400
    },
    stream: process.stdout
}));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, '../client/views')));

// Express Session
app.use(session({
    secret: conn.secret,
    saveUninitialized: true,
    resave: true
}));

// Passport init 
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

function patientLogin(req, res, next) {
    if (req.isAuthenticated() && req.user.isPatient) {
        return next();
    } else {
        res.redirect("/health/login/record");
    }
}
//////////////////////////////////////////////////
//            Set Static Path
/////////////////////////////////////////////////
app.use(express.static(path.join(__dirname, '../client')));

app.use('/styles', express.static(path.join(__dirname, '../client/assets/styles')));
app.use('/scripts', express.static(path.join(__dirname, '../client/assets/scripts')));
app.use('/images', express.static(path.join(__dirname, '../client/assets/images')));
app.use('/fonts', express.static(path.join(__dirname, '../client/assets/fonts')));
app.use('/config', express.static(path.join(__dirname, '/config')));

//////////////////////////////////////////////////
//          ROUTER
/////////////////////////////////////////////////
const publicRoutes = require("./routes/publicRoutes");
const privateUsersRoutes = require("./routes/privateUserRoutes")


//////////////////////////////////////////////////
//            Routes
/////////////////////////////////////////////////

// catch 404 and forward to error handler
// 404
app.use((req, res, next) => {
    const date = new Date().getFullYear();
    res.redirect('/');
});

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.use('/public', publicRoutes)
app.use('/private/users', privateUsersRoutes)

///////////////////////////////////////////
//  Start Server
//////////////////////////////////////////
const port = process.env.PORT || 6900;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});