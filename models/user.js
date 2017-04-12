/**
 * Created by yopat on 2017-04-10.
 */

// reference mongoose
let mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');

// this is needed to tell app this model is for managing user accounts;
// it is not a reular model like school
let plm = require('passport-local-mongoose');
let findOrCreate = require('mongoose-findorcreate');

let userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

userSchema.pre('save', function(next) {
    var user = this;
    var SALT_FACTOR = 5;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// enable plm on this account
userSchema.plugin(plm);
userSchema.plugin(findOrCreate);

// make the model public
module.exports = mongoose.model('User', userSchema);