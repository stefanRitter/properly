angular.module('app').controller('appHomeEditCtrl', function ($scope, $routeParams) {
  'use strict';

  $scope.id = $routeParams.id;
});
