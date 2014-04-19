angular.module('app').directive('homeSideView', function (appCachedHomes) {
  'use strict';

  return {
    restrict: 'C',
    replace: false,
    priority: 1000,
    controller: ['$scope', '$element', function($scope) {
      $scope.home = {};

      $scope.$on('appShowHome', function(e, data) {
        if ($scope.home._id === data._id) { return; }
        $scope.home._id = data._id;
        $scope.home = appCachedHomes.get(data._id);
      });
    }]
  };
});
