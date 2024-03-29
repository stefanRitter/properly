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
  
  salt:     {type: String, required: '{PATH} is required!'},
  password: {type: String, required: '{PATH} is required!'},
  roles:    [String],

  alerts: [String],
  homes: [String],
  savedHomes: [String],

  avatar: {type: String},

  profile: {
    firstName: {type: String, trim: true},
    lastName: {type: String, trim: true},
    curretTitle: {type: String, trim: true},
    coTenants: {type: Number},
    phoneNum: {type: Number},
    householdIncome: {type: String},
    pets: {type: String}
  },

  verified: {
    phoneNum: {type: Boolean, default: false},
    email: {type: Boolean, default: false},
    householdIncome: {type: Boolean, default: false}
  }
});

userSchema.methods.addProHome = function(home) {
  if (this.homes.indexOf(home._id) === -1) {
    this.homes.push(home._id);
    if (this.homes.length > 100) {
      // limit to max 100 homes
      this.homes.pop();
    }
    this.save();
  }
};

// remove sensitive data
userSchema.methods.safe = function() {
  return {
    _id: this._id,
    email: this.email,
    roles: this.roles,
    homes: this.homes,
    savedHomes: this.savedHomes,
    alerts: this.alerts,
    profile: this.profile,
    avatar: this.avatar
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
      
      User.findOneAndUpdate({email: 'unverified@properly.io'}, {email: 'unverified@properly.io',
        name: 'unverified', salt: salt, password: pwd, roles: ['user']},
        {upsert: true}, function(err) {
        if (err) { throw err; }
      });
      User.findOneAndUpdate({email: 'verified@properly.io'}, {email: 'verified@properly.io',
        name: 'Verified', salt: salt, password: pwd, roles: ['user', 'verified']},
        {upsert: true}, function(err) {
        if (err) { throw err; }
      });
      User.findOneAndUpdate({email: 'owner@properly.io'}, { email: 'owner@properly.io', salt: salt,
        name: 'Owner', password: pwd, roles: ['pro']}, {upsert: true}, function(err) {
        if (err) { throw err; }
      });
      User.findOneAndUpdate({email: 'admin@properly.io'}, { email: 'admin@properly.io', salt: salt,
        name: 'Admin', password: pwd, roles: ['admin']}, {upsert: true}, function(err) {
        if (err) { throw err; }
      });
    }
  });
};
