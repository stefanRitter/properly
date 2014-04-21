angular.module('app').controller('appProfileEditCtrl', function ($scope, $routeParams, $location, appIdentity) {
  'use strict';

  //var steps = ['basic', 'references', 'verify'];

  $scope.step = $routeParams.step;
  $scope.profile = appIdentity.currentUser.profile;


  $scope.getStep = function() {
    return '/partials/profile/edit/'+$scope.step;
  };

  $scope.nextStep = function(step) {
    $location.path('/account/profile/'+step);
  };

  $scope.activeStep = function(step) {
    return step === $scope.step;
  };
});
