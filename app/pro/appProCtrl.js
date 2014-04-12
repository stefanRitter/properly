angular.module('app').controller('appProCtrl', function ($scope, $location, appAuth, appNotifier) {
  'use strict';

  $scope.signup = function() {
    var newUserData = {
      email: $scope.email,
      password: $scope.password
    };

    appAuth.createUser(newUserData).then(function() {
      $location.path('/verify');
    }, function(reason) {
      appNotifier.error(reason, $scope);
    });
  };
});
