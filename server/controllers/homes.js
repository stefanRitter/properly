'use strict';

var mongoose = require('mongoose'),
    Home = mongoose.model('Home');

function validateHome(data) {
  delete data._id;
  return data;
}

exports.searchHomes = function (req, res) {
  console.log('SEARCH HOME: ', req.body);
  
  Home.find().exec(function (err, collection) {
    res.send(collection);
  });
};

exports.getHome = function (req, res) {
  Home.findOne({_id: req.params.id}).exec(function (err, home) {
    if (err) { throw err; }
    res.send(home);
  });
};

exports.updateHome = function (req, res) {
  var newHome = validateHome(req.body),
      id = req.body._id,
      returnHome = function(err, home) {
        if (err) { throw err; }
        res.json(home);
      };

  if (!!id) {
    Home.findOneAndUpdate({_id: id}, newHome, {upsert: true}, returnHome);
  } else {
    Home.create(newHome, returnHome);
  }
};