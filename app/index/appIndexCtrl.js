angular.module('app').controller('appIndexCtrl', function ($scope, $location, $anchorScroll) {
  'use strict';
  $anchorScroll();
  $scope.gotoAbout = function() {
    $location.hash('about');
  };
});
