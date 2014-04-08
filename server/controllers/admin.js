'use strict';

exports.get = function(req, res) {
  res.render('main', {
    bootstrappedUser: req.user,
    admin: true
  });
};
