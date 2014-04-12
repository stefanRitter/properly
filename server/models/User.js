'use strict';

var mongoose = require('mongoose'),
    encrypt = require('../utils/encryption.js'),
    userSchema, User;


userSchema = mongoose.Schema({
  email: {
    type: String,
    required: '{PATH} is required!',
    trim: true,
    lowercase: true,
    unique: true,
    index: true
  },

  logins: [String],
  
  name:     {type: String, trim: true, required: false},
  location: {type: String, trim: true, required: false},
  lang:     {type: String, trim: true, required: false},
  url:      {type: String, trim: true, required: false},
  
  salt:     {type: String, required: '{PATH} is required!'},
  password: {type: String, required: '{PATH} is required!'},
  roles:    [String],
});

// remove sensitive data
userSchema.methods.safe = function() {
  return {
    _id: this._id,
    name: this.name || this.email,
    email: this.email,
    roles: this.roles,
    buzzrs: this.buzzrs,
    readlater: this.readlater,
    activities: this.activities
  };
};

userSchema.methods.recordLogin = function() {
  var today = (new Date()).toLocaleDateString();
  if (today !== this.logins[0]) {
    this.logins.unshift(today);
    if (this.logins.length > 100) {
      this.logins.pop();
    }
    this.save();
  }
};

userSchema.methods.hasRole = function(role) {
  return this.roles.indexOf(role) > -1 || this.roles.indexOf('admin') > -1;
};

userSchema.methods.authenticated = function(passwordToMatch) {
  return encrypt.hashPwd(this.salt, passwordToMatch) === this.password;
};

User = mongoose.model('User', userSchema);

// seed users
exports.createDefaultUsers = function() {
  User.find({}).exec(function(err, collection) {
    if (collection.length === 0) {
      var salt = encrypt.createSalt();
      var pwd = encrypt.hashPwd(salt, 'Buzzr2014');
      
      User.findOneAndUpdate({email: 'verified@properly.io'}, {email: 'verified@properly.io',
        name: 'Verified', salt: salt, password: pwd, roles: ['verified']},
        {upsert: true}, function(err) {
        if (err) { throw err; }
      });
      User.findOneAndUpdate({email: 'owner@properly.io'}, { email: 'owner@properly.io', salt: salt,
        name: 'Owner', password: pwd, roles: ['owner']}, {upsert: true}, function(err) {
        if (err) { throw err; }
      });
      User.findOneAndUpdate({email: 'admin@properly.io'}, { email: 'admin@properly.io', salt: salt,
        name: 'Admin', password: pwd, roles: ['admin']}, {upsert: true}, function(err) {
        if (err) { throw err; }
      });
    } else {
      User.findOne({email: 'stefan@buzzr.io'}, function(err, obj) {
        if (err) { throw err; }
        obj.remove();
      });
      User.findOne({email: 'jeroen@buzzr.io'}, function(err, obj) {
        if (err) { throw err; }
        obj.remove();
      });
    }
  });
};
