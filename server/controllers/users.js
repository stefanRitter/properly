'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    encrypt = require('../utils/encryption.js'),
    _ = require('lodash');


exports.getUser = function (req, res) {
  User.find().exec(function (err, collection) {
    res.send(collection);
  });
};


exports.createUser = function (req, res, next) {
  var userBody = req.body;
  
  userBody.email = userBody.email.toLowerCase();
  userBody.salt = encrypt.createSalt();
  userBody.password = encrypt.hashPwd(userBody.salt, userBody.password);

  User.create(userBody, function (err, user) {
    if (err) {
      if (err.toString().indexOf('E11000') > -1) {
        err = new Error('User already exists. Please get in touch if you need help logging in!');
      }
      
      res.status(400);
      return res.send({reason: err.toString()});
    }

    req.logIn(user, function (err) {
      if (err) { return next(err); }
      res.send();
    });
  });
};


exports.updateUser = function (req, res) {
  var userUpdates = req.body;

  if (userUpdates.password && userUpdates.password.length > 0) {
    req.user.salt = encrypt.createSalt();
    req.user.password = encrypt.hashPwd(req.user.salt, userUpdates.password);
  }

  req.user.email = userUpdates.email;
  req.user.readlater = userUpdates.readlater;
  req.user.buzzrs = _.uniq(userUpdates.buzzrs);
  req.user.activities = userUpdates.activities;
  
  req.user.save(function (err) {
    if (err) {
      var reason = err.toString();
      if (err.toString().indexOf('E11000') > -1) {
        reason = 'Email already exists, please choose another';
      }
      return res.status(400).send({reason: reason});
    }
    res.send(req.user.safe());
  });
};


// called from Twitter login
exports.findOrCreate = function(userData, done) {
  var profile = userData.profile._json,
      email = profile.screen_name,
      newUser = {};
  
  User.findOne({email: email}).exec(function (err, foundUser) {
    if (err) { return done(err, null); }
    if (foundUser) { return done(null, foundUser); }

    newUser.provider = {
      token: userData.token,
      secret: userData.secret,
      name: userData.profile.provider,
      providerId: profile.id_str
    };
    newUser.name = profile.name;
    newUser.location = profile.location;
    newUser.lang = profile.lang;
    newUser.url = profile.url;

    newUser.email = email;
    newUser.salt = 'twitter';
    newUser.password = 'twitter';

    User.create(newUser, function (err, createdUser) {
      if (err) { return done(err, null); }
      done(null, createdUser);
    });
  });
};