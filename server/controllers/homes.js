'use strict';

var mongoose = require('mongoose'),
    Home = mongoose.model('Home');


exports.searchHomes = function (req, res) {
  Home.find().exec(function (err, collection) {
    res.send(collection);
  });
};


exports.getHome = function (req, res) {
  Home.find(req.id).exec(function (err, collection) {
    res.send(collection);
  });
};


exports.createHome = function (req, res) {
  req = {};
  res = {};
};


exports.updateHome = function (req, res) {
  req = {};
  res = {};
};
