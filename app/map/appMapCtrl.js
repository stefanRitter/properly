angular.module('app').controller('appMapCtrl', function ($scope, AppHome, appMap) {
  'use strict';

  $scope.search = {
    pets: 'None',
    smoker: false
  };

  AppHome.query(function(data) {
    data.forEach(function(home) {
      var markerData = {
        loc: home.loc,
        price: home.price,
        beds: home.bedrooms,
        img: home.pictures[0]
      };
      appMap.setMarker(markerData);
    });
  });
});
