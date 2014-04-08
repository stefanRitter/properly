'use strict';

var express = require('express'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    SessionStore = require('connect-mongo')(express);


module.exports = function(app, config) {

  app.configure(function() {
    app.set('views', config.rootPath + '/server/views');
    app.set('view engine', 'jade');

    app.use(express.logger('dev'));

    app.use(express.compress());
    app.use(express.cookieParser(process.env.COOKIE_SECRET || 'cookie secret'));
    app.use(express.json());
    app.use(express.urlencoded());
    
    app.use(express.session({
      secret: process.env.SESSION_SECRET || 'session secret',
      store: new SessionStore({ mongoose_connection: mongoose.connection})
    }));
    
    // setup csrf for angular
    app.use(express.csrf({value: function(req) {
      return req.headers['x-xsrf-token'];
    }}));
    app.use(function(req, res, next) {
      res.cookie('XSRF-TOKEN', req.csrfToken());
      next();
    });

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(express.static(config.rootPath + '/public'));
  });
};
