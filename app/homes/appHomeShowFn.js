angular.module('app').factory('appHomeShowFn', function ($location) {
  'use strict';

  // export all the functionality of a home show view
  // in it's different contexts throughout the app
  // as standalone view or as part of the home-side-view directive

  return function($scope) {
    return {
      path: function(path) {
        return $location.path() === path;
      },
      save: function() {
        window.alert($scope.home._id);
      },
      apply: function() {
        window.alert($scope.home._id);
      },
      contact: function() {
        window.alert($scope.home._id);
      },
      report: function() {
        window.alert($scope.home._id);
      }
    };
  };
});