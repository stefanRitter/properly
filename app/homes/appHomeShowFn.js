angular.module('app').factory('appHomeShowFn', function ($location) {
  'use strict';

  // export all the functionality for showing a home in it's different contexts throughout the app
  // as standalone view
  // or as part of the home-side-view directive
  return {
    path: function(path) {
      return $location.path() === path;
    }
  };
});