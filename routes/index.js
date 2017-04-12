var express = require('express');
var router = express.Router();

//add passport for req and llogin
let passport = require('passport');
let User = require('../models/user');
let nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var flash = require('express-flash');
var globals = require('../config/globals');

router.get('/', function(req, res){
    res.render('index', {
        title: 'Express',
        user: req.user
    });
});

router.get('/login', function(req, res, next) {

    let messages = req.session.message || [];

    // Clear message form session
    req.session.messages = [];
    res.render('login', {
        title:'Login Here',
        messages: messages,
        user: null
    });
});

// post handler for login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/books',
    failureRedirect: '/login',
    failureMessage: 'Invalid Login'
}));


router.get('/logout', function(req, res, next){
    req.logout();
    res.redirect('/');
});

router.get('/register', function(req, res) {
    res.render('register', {
        user: req.user
    });
});

router.post('/register', function(req, res, next) {
    User.register(new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password}),
        req.body.password, function(err,user) {
            if(err){
                console.log(err);
                res.render('error', {title: 'Create Account Error'});
            }
            res.redirect('/login');
        });
});

// get facebook
router.get('/facebook',
    passport.authenticate('facebook', { scope: 'email'}));

// get facebook callback
router.get('/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/login',
        scope: 'email' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/books');
    });

// get google
router.get('/google',
    passport.authenticate('google', { scope:
        [ 'https://www.googleapis.com/auth/plus.login',
            , 'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
    ));

router.get( '/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/books',
        failureRedirect: '/login'
    }));

module.exports = router;
