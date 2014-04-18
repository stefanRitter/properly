'use strict';

var mongoose = require('mongoose'),
    homeSchema, Home;


homeSchema = mongoose.Schema({
  
});

Home = mongoose.model('Home', homeSchema);

// seed homes
exports.createDefaultHomes = function() {
  Home.find({}).exec(function(err, collection) {
    if (collection.length === 0) {
      
      Home.findOneAndUpdate({}, {},
        {upsert: true}, function(err) {
        if (err) { throw err; }
      });
    }
  });
};
