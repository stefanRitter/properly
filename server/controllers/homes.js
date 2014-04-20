'use strict';

var mongoose = require('mongoose'),
    Home = mongoose.model('Home');

function orBoolean(newData, original) {
  if (newData === undefined) {
    return original;
  }
  return newData;
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
  var newHome = req.body;

  Home.findOne({_id: req.body._id}, function(err, home) {
    /*jshint maxstatements: false */
    /*jshint maxcomplexity: false */
    
    if (err) { throw err; }
    if (!home) { home = new Home(); }
    
    home.proAccount = home.proAccount || req.user._id;

    home.published = home.published;
    home.type = newHome.type || home.type;
    
    
    home.longRent = orBoolean(newHome.longRent, home.longRent);
    home.shortRent = orBoolean(newHome.shortRent, home.shortRent);
    home.contactEmail = orBoolean(newHome.contactEmail, home.contactEmail);
    home.contactPhone = orBoolean(newHome.contactPhone, home.contactPhone);

    home.price = newHome.price || home.price;
    home.size = newHome.size || home.size;
    home.dimSys = newHome.dimSys || home.dimSys;
    home.bills = newHome.bills || home.bills;
    home.bedrooms = newHome.bedrooms || home.bedrooms;
    home.bathrooms = newHome.bathrooms || home.bathrooms;
    home.livingRooms = newHome.livingRooms || home.livingRooms;

    // get location
    home.postcode = newHome.postcode || home.postcode;
    home.address = newHome.address || home.address;
    home.city = 'london';
    home.loc = newHome.loc || home.loc;
    
    home.description = newHome.description || home.description;
    home.features = newHome.features || home.features;
    home.furnished = newHome.furnished || home.furnished;
    home.pets = newHome.pets || home.pets;

    // images
    home.pictures = [];
    
    home.save(function (err) {
      if (err) {
        res.status(400);
        return res.send({reason: err.toString()});
      }
      req.user.addProHome(home);
      res.json(home);
    });
  });
};