angular.module('app').controller('appAccountCtrl', function ($scope, $location, appAuth) {
  'use strict';

  $scope.signout = function() {
    appAuth.logoutUser().then(function() {
      $location.path('/');
    });
  };
});
