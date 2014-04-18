'use strict';

var auth = require('../controllers/auth.js'),
    users = require('../controllers/users.js'),
    view = require('../controllers/views.js'),
    homes = require('../controllers/homes.js'),
    feedback = require('../controllers/feedback.js'),
    admin = require('../controllers/admin.js');


module.exports = function (app) {
  /*jshint maxstatements: false */

  // APP
  app.get('/',          view('index'));
  app.get('/map',       view('map'));
  app.get('/pro',       view('pro'));
  app.get('/saved',     view('main'));
  app.get('/login',     view('main'));
  app.get('/join',      view('main'));
  app.get('/home/:id',  view('main'));

  app.get('/verify',    view('main'));
  app.get('/pro/*',     view('main'));
  app.get('/account/*', view('main'));


  // VIEW PARTIALS
  app.get('/partials/*', function (req, res) {
    res.render('../../app/' + req.params);
  });

  // API
  app.post('/api/users',     users.createUser);
  app.put( '/api/users',     auth.authorize, users.updateUser);
  app.post('/api/feedback',  feedback.createFeedback);
  app.get( '/api/homes',     homes.searchHomes);
  app.get( '/api/homes/:id', homes.getHome);
  app.post('/api/homes',     auth.requiresRole('pro'), homes.updateHome);

  // AUTH
  app.post('/login',         auth.authenticateLocal);
  app.post('/logout',        auth.logout);

  // ADMIN
  app.get('/admin/*',        auth.requiresRole('admin'), admin.get);
  app.get('/api/users',      auth.requiresRole('admin'), users.getUsers);
  
  // 404
  app.all('/api/*', function (req, res) { res.send(404); });
  app.get('*', function (req, res) { res.status(404).redirect('/'); });
};
