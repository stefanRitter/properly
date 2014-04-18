angular.module('app').controller('appProDashboardCtrl', function ($scope, appIdentity) {
  'use strict';

  $scope.homes = appIdentity.currentUser.homes || [];

  $scope.hasHome = function() {
    return $scope.homes.length > 0;
  };
});
