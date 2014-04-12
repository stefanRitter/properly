angular.module('app').factory('appIdentity', function ($window, $location, AppUser) {
  'use strict';

  var appIdentity = {
    currentUser: undefined,
    
    isAuthenticated: function() {
      return !!this.currentUser;
    },
    
    isAuthorized: function(role) {
      return !!this.currentUser && this.checkRole(role);
    },
    
    checkRole: function(role) {
      return this.currentUser.roles.indexOf('admin') > -1 || this.currentUser.roles.indexOf(role) > -1;
    }
  };


  if (!!$window.bootstrappedUser) {
    var currentUser = new AppUser();
    angular.extend(currentUser, $window.bootstrappedUser);
    appIdentity.currentUser = currentUser;

    if (!appIdentity.checkRole('verified')) {
      $location.path('/verify');
    }
  }

  return appIdentity;
});
