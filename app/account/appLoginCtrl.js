angular.module('app').controller('appLoginCtrl', function ($scope, $location, appAuth, appNotifier, appIdentity) {
  'use strict';

  $scope.signin = function() {
    appAuth
      .authenticateUser($scope.email, $scope.password)
      .then(function(success) {
        if (success) {
          if (appIdentity.hasRole('pro')) {
            $location.path('/pro/dashboard');
          } else {
            $location.path('/map');
          }
        } else {
          appNotifier.error('email/password combination incorrect', $scope);
        }
      });
  };
});
