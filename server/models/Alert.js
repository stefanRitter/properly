'use strict';

var mongoose = require('mongoose'),
    alertSchema, Alert;


alertSchema = mongoose.Schema({
  
});

Alert = mongoose.model('Alert', alertSchema);

// seed homes
exports.createDefaultAlerts = function() {
  /*Home.find({}).exec(function(err, collection) {
    if (collection.length === 0) {
      
      Home.findOneAndUpdate({}, {},
        {upsert: true}, function(err) {
        if (err) { throw err; }
      });
    }
  });*/
};
