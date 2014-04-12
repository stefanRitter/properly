angular.module('app').factory('appIdentity', function ($window, $location, AppUser) {
  'use strict';

  var currentUser;

  function checkRole(role) {
    return currentUser.roles.indexOf('admin') > -1 || currentUser.roles.indexOf(role) > -1;
  }
  
  if (!!$window.bootstrappedUser) {
    currentUser = new AppUser();
    angular.extend(currentUser, $window.bootstrappedUser);
    if (!checkRole('verified')) {
      $location.path('/verify');
    }
  }

  return {
    currentUser: currentUser,
    isAuthenticated: function() {
      return !!this.currentUser;
    },
    isAuthorized: function(role) {
      return !!this.currentUser && checkRole(role);
    }
  };
});
