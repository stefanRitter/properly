angular.module('app').controller('appHomeShowCtrl', function ($scope, $routeParams, appCachedHomes) {
  'use strict';

  $scope.home = appCachedHomes.get($routeParams.id);
});
