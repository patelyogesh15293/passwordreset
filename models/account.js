/**
 * Created by yopat on 2017-03-08.
 */

// reference mongoose
let mongoose = require('mongoose');

// this is needed to tell app this model is for managing user accounts;
// it is not a reular model like book
let plm = require('passport-local-mongoose');
let findOrCreate = require('mongoose-findorcreate');

// create the schema username and password are automatically included
let accountSchema = new mongoose.Schema({});

// enable plm on this account
accountSchema.plugin(plm);
accountSchema.plugin(findOrCreate);

// make the model public
module.exports = mongoose.model('Account', accountSchema);