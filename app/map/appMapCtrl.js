angular.module('app').controller('appMapCtrl', function ($scope, appMap) {
  'use strict';

  $scope.map = {};
  appMap.init();
  appMap.setMarker();
});
