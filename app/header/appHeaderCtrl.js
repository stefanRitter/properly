angular.module('app').controller('appHeaderCtrl', function ($scope, $location, appIdentity) {
  'use strict';

  $scope.user = appIdentity.currentUser;
  
  $scope.onPath = function() {
    for (var i = 0, len = arguments.length; i < len; i++) {
      if (arguments[i] === $location.path()) {
        return true;
      }
    }
  };

  $scope.isLoggedIn = function(role) {
    if (role) { return appIdentity.isAuthorized(role); }
    return appIdentity.isAuthenticated();
  };
});
