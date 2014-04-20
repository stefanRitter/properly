angular.module('app').controller('appMapCtrl', function ($scope, $rootScope, appCachedHomes, appMap) {
  'use strict';

  $scope.search = {
    pets: 'None'
  };

  appCachedHomes.search({}, function(data) {
    data.forEach(function(home) {
      var markerData = {
        _id: home._id,
        loc: home.loc,
        price: home.price,
        beds: home.bedrooms,
        img: home.pictures[0]
      };
      appMap.setMarker(markerData);
    });
  });

  $scope.closeView = function() {
    $rootScope.$broadcast('appCloseShowHome');
  };
});
