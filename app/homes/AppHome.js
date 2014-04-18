angular.module('app').factory('AppHome', function ($resource) {
  'use strict';

  var HomeResource = $resource('/api/homes/:id', {_id: '@id'}, {
    update: { method: 'PUT', isArray: false }
  });

  return HomeResource;
});
