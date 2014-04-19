angular.module('app').factory('appGeocoder', function (appGoogle, $q) {
  'use strict';
  
  var google = appGoogle,
      geocoder = new google.maps.Geocoder();
  
  function geocode(stringAddress) {
    var dfd = $q.defer();
    geocoder.geocode( {'address': stringAddress}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        var coords = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };
        dfd.resolve(coords);
      } else {
        window.alert('Geocode was not successful for the following reason: ' + status);
      }
    });
    return dfd.promise;
  }

  return {
    geocode: geocode
  };
});