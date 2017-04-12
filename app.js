var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var nodemailer = require('nodemailer');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var flash = require('express-flash');

// passport dependancies
let passport = require('passport');
let session = require('express-session');

var index = require('./routes/index');

// reference the books controller we created
var books = require('./routes/books');
// reference the users controller
var users = require('./routes/users');

var app = express();

// use mongoose to connect to mongodb
var mongoose = require('mongoose');
var conn = mongoose.connection;

// link to config file
var globals = require('./config/globals');

conn.open(globals.db);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
//configure passport and session
app.use(session({
  secret: "Some salt value here",
  resave: true,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// link too the new model
let Account = require('./models/account');
passport.use(Account.createStrategy());

// facebook authentication
let FacebookStrategy = require("passport-facebook").Strategy;

passport.use(new FacebookStrategy({
        clientID: globals.facebook.clientID,
        clientSecret: globals.facebook.clientSecret,
        callbackURL: globals.facebook.callbackURL,
        profileFields: ['id', 'displayName', 'emails']
    },
    function(accessToken, refreshToken, profile, cb) {
        Account.findOrCreate({ username: profile.emails[0].value }, function (err, user) {
            console.log(profile);
            return cb(err, user);
        });
    }
));

// google auth
var GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
        clientID:     globals.google.clientID,
        clientSecret: globals.google.clientSecret,
        callbackURL:  globals.google.callbackURL,
        passReqToCallback   : true
    },
    function(request, accessToken, refreshToken, profile, done) {
        Account.findOrCreate({ username: profile.emails[0].value }, function (err, user) {
            return done(err, user);
        });
    }
));

passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
        if (err) return done(err);
        if (!user) return done(null, false, { message: 'Incorrect username.' });
        user.comparePassword(password, function(err, isMatch) {
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password.' });
            }
        });
    });
}));

// manage use loggin status through db
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// router always after initialize model
app.use('/', index);
app.use('/users', users);
app.use('/books', books); // handle all requests at /books with books router

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
   res.render('error', {
   title: 'Comp-2068 Book Store',
       user: req.error
   });
});

module.exports = app;
