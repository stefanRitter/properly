angular.module('app').controller('appAdminUsersCtrl', function ($scope, AppUser) {
  'use strict';
  
  $scope.users = AppUser.query();
});