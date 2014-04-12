angular.module('app').controller('appProDashboardCtrl', function ($scope, $location, appAuth) {
  'use strict';

  $scope.signout = function() {
    appAuth.logoutUser().then(function() {
      $location.path('/');
    });
  };
});
