'use strict';

var mongoose = require('mongoose'),
    homeSchema, Home;


homeSchema = mongoose.Schema({
  published: {type: Boolean, default: false, index: true},
  type: {type: String, index: true},
  
  longRent: {type: Boolean, index: true},
  shortRent: {type: Boolean, index: true},
  
  price: {type: Number, index: true},
  size: {type: Number, index: true},
  dimSys: {type: String, default: 'sqm'},
  bills: {type: String},
  
  bedrooms: {type: Number, index: true},
  bathrooms: {type: Number, index: true},
  livingrooms: {type: Number, index: true},
    
  postcode: {type: String},
  address: {type: String},
  city: {
    type: String,
    trim: true,
    lowercase: true,
    default: 'london'
  },
  loc: {
    type: [Number],
    index: '2dsphere'
  },
  
  description: {type: String},
  features: [String],

  pets: {type: String, index: true},
  furnished: {type: String, index: true},

  contactEmail: {type: Boolean},
  contactPhone: {type: Boolean},
  proAccount: {type: String, index: true},

  pictures: [String]
});

Home = mongoose.model('Home', homeSchema);

// seed homes
exports.createDefaultHomes = function() {
  /*Home.find({}).exec(function(err, collection) {
    if (collection.length === 0) {
      
      Home.findOneAndUpdate({}, {},
        {upsert: true}, function(err) {
        if (err) { throw err; }
      });
    }
  });*/
};
