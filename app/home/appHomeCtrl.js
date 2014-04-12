angular.module('app').controller('appHomeCtrl', function ($scope, $location, $anchorScroll) {
  'use strict';
  $anchorScroll();
  $scope.gotoAbout = function() {
    $location.hash('about');
  };
});
