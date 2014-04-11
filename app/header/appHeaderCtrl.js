angular.module('app').controller('appHeaderCtrl', function ($scope, $location) {
  'use strict';
  
  $scope.onPath = function(url) {
    return url === $location.path();
  };
});
