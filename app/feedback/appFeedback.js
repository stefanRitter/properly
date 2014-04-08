angular.module('app').factory('appFeedback', function ($rootScope) {
  'use strict';

  return {
    toggle: function() {
      $rootScope.$broadcast('toggleFeedback');
    }
  };
});
