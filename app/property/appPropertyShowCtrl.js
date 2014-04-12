angular.module('app').controller('appPropertyShowCtrl', function ($scope, $routeParams) {
  'use strict';

  $scope.id = $routeParams.id;
});
