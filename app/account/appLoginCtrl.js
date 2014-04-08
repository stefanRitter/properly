angular.module('app').controller('appLoginCtrl', function ($scope, $location, appAuth, appNotifier) {
  'use strict';

  $scope.signin = function() {
    
    appAuth
      .authenticateUser($scope.email, $scope.password)
      .then(function(success) {
        if (success) {
          $location.path('/');
        } else {
          appNotifier.error('email/password combination incorrect', $scope);
        }
      });
  };
});
