var express = require('express');
var router = express.Router();

//add passport for req and llogin
let passport = require('passport');
let Account = require('../models/account');

/* GET users listing. */
router.get('/', function(req, res, next) {
  // use mongoose model to query mongodb for all users
  Account.find(function(err, users) {
    let _id = req.params._id;

    if (err) {
      console.log(err);
      res.end(err);
      return;
    }

    // no error so send the books to the index view
    res.render('users/index', {
      users: users,
      title: "Users",
      user: req.user
    });
  });
});

module.exports = router;
