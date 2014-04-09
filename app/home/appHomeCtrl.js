angular.module('app').controller('appHomeCtrl', function ($scope, appIdentity) {
  'use strict';

  $scope.identity = appIdentity;
});
