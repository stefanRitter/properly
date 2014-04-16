angular.module('app').controller('appHomeShowCtrl', function ($scope, $routeParams) {
  'use strict';

  $scope.id = $routeParams.id;
});
