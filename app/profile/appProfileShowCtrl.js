angular.module('app').controller('appProfileShowCtrl', function ($scope, $routeParams) {
  'use strict';

  $scope.profile = $routeParams.id;
});
