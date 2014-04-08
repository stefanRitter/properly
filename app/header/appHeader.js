angular.module('app').factory('appHeader', function ($rootScope) {
  'use strict';

  var header = {};

  header.toggle = function() {
    $rootScope.$broadcast('toggleHeader');
  };
  
  return header;
});
