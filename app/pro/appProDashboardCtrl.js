angular.module('app').controller('appProDashboardCtrl', function ($scope, appIdentity) {
  'use strict';

  $scope.hasHome = function() {
    return appIdentity.currentUser.homes.length > 0;
  };
});
