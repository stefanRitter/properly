'use strict';

module.exports = function(view) {
  return function(req, res) {
    res.render(view, {
      bootstrappedUser: req.user
    });
  };
};
