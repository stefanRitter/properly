angular.module('app').factory('appNotifier', function() {
  'use strict';

  return {
    notify: function(msg, scope) {
      scope.notifier = {};
      scope.notifier.notice = msg;
      setTimeout(function() {
        scope.notifier.notice = '';
        scope.$digest();
      }, 4000);
    },
    error: function(msg, scope) {
      scope.notifier = {};
      scope.notifier.error = msg;
      setTimeout(function() {
        scope.notifier.error = '';
        scope.$digest();
      }, 4000);
    }
  };
});
