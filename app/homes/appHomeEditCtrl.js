angular.module('app').controller('appHomeEditCtrl', function ($scope, $routeParams) {
  'use strict';

  $scope.id = $routeParams.id;
  $scope.step = $routeParams.step;

  $scope.getStep = function() {
    return '/partials/homes/edit/' + $scope.step;
  };

  $scope.activeStep = function(step) {
    return step === $scope.step;
  };

});
