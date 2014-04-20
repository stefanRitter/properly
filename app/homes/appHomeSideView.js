angular.module('app').directive('homeSideView', function (appCachedHomes, $location) {
  'use strict';

  return {
    restrict: 'C',
    replace: false,
    priority: 1000,
    templateUrl: '/partials/homes/show',
    controller: ['$scope', '$element', function($scope) {
      $scope.home = {};
      $scope.path = $location.path();

      $scope.$on('appShowHome', function(e, data) {
        if ($scope.home._id === data._id) { return; }
        angular.element(document.getElementById('blackout')).addClass('show');
        angular.element(document.getElementById('homeView')).addClass('show');

        $scope.$apply(function() {
          $scope.home._id = data._id;
          $scope.home = appCachedHomes.get(data._id);
        });
      });

      $scope.$on('appCloseShowHome', function() {
        $scope.close();
      });

      $scope.close = function() {
        angular.element(document.getElementById('blackout')).removeClass('show');
        angular.element(document.getElementById('homeView')).removeClass('show');
        $scope.home = {};
      };
    }]
  };
});
