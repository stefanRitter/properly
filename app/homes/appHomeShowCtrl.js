angular.module('app').controller('appHomeShowCtrl', function ($scope, $routeParams, appCachedHomes, appHomeShowFn) {
  'use strict';

  $scope.home = appCachedHomes.get($routeParams.id);
  $scope.homeFn = appHomeShowFn;
});
