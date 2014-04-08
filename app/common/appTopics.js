angular.module('app').factory('appTopics', function ($window) {
  'use strict';

  var topics = [];
  
  if (!!$window.bootstrappedTopics) {
    topics = $window.bootstrappedTopics;
  }

  return topics;
});
