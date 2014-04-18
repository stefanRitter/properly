angular.module('app').controller('appHomeEditCtrl', function ($scope, $routeParams, AppHome) {
  'use strict';

  $scope.id = $routeParams.id;
  $scope.step = $routeParams.step;

  $scope.home = new AppHome();

  $scope.getStep = function() {
    return '/partials/homes/edit/' + $scope.step;
  };

  $scope.activeStep = function(step) {
    return step === $scope.step;
  };

  if ($scope.id !== 'new') {
    $scope.home = AppHome.$get({_id: $scope.id});
  }
});
