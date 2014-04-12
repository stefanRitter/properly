'use strict';

var auth = require('../controllers/auth.js'),
    users = require('../controllers/users.js'),
    pages = require('../controllers/pages.js'),
    feedback = require('../controllers/feedback.js'),
    admin = require('../controllers/admin.js');


module.exports = function (app) {
  /*jshint maxstatements: false */

  // APP
  app.get('/',        pages('index'));
  app.get('/map',     pages('map'));
  app.get('/pro',     pages('pro'));
  app.get('/:id',     pages('main'));
  
  app.get('/home/:id', pages('main'));
  app.get('/home/:id/edit', auth.requiresRole('pro'), pages('main'));

  // VIEW PARTIALS
  app.get('/partials/*', function (req, res) {
    res.render('../../app/' + req.params);
  });

  // API
  app.post('/api/users',       users.createUser);
  app.put( '/api/users',       auth.authorize, users.updateUser);
  app.post('/api/feedback',    feedback.createFeedback);

  // AUTH
  app.post('/login',            auth.authenticateLocal);
  app.post('/logout',           auth.logout);

  // ADMIN
  app.get('/admin/*',        auth.requiresRole('admin'), admin.get);
  app.get('/api/users',      auth.requiresRole('admin'), users.getUser);
  
  // 404
  app.all('/api/*', function (req, res) { res.send(404); });
  app.get('*', function (req, res) { res.status(404).redirect('/'); });
};
