angular.module('app').factory('appIdentity', function ($window, $location, AppUser) {
  'use strict';

  var currentUser;
  
  if (!!$window.bootstrappedUser) {
    currentUser = new AppUser();
    angular.extend(currentUser, $window.bootstrappedUser);
    if (!currentUser.verified) {
      $location.path('/verify');
    }
  }

  return {
    currentUser: currentUser,
    isAuthenticated: function() {
      return !!this.currentUser;
    },
    isAuthorized: function(role) {
      return !!this.currentUser &&
        (this.currentUser.roles.indexOf(role) > -1 || this.currentUser.roles.indexOf('admin') > -1);
    }
  };
});
