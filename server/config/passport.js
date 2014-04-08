'use strict';

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose'),
    User = mongoose.model('User');


module.exports = function () {
  passport.use(new LocalStrategy(
    function (username, password, done) {
      User.findOne({email: username}).exec(function (err, user) {
        if (user && user.authenticated(password)) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    }
  ));

  passport.serializeUser(function (user, done) {
    if (user) { done(null, user.id); }
  });

  passport.deserializeUser(function (id, done) {
    User.findOne({_id: id}).exec(function (err, user) {
      if (user) {
        user.recordLogin();
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  });
};
