angular.module('app').factory('AppHome', function ($resource) {
  'use strict';

  var HomeResource = $resource('/api/homes/:id', {_id: '@id'}, {});
  return HomeResource;
});


angular.module('app').factory('appCachedHome', function (AppHome) {
  'use strict';
  var cachedHome = {};

  return {
    get: function(id) {
      if (id === 'new') {
        cachedHome = new AppHome();
      }
      else if (cachedHome._id !== id) {
        cachedHome = AppHome.get({id: id});
      }
      return cachedHome;
    },
    set: function(newHome) {
      cachedHome = newHome;
    }
  };
});


angular.module('app').factory('appCachedHomes', function (AppHome) {
  'use strict';
  var cachedHomes = [];

  return {
    search: function(search, cb) {
      if (!!search || !cachedHomes) {
        cachedHomes = AppHome.query(search, cb);
      }
      return cachedHomes;
    },
    
    get: function(id) {
      var home;
      cachedHomes.forEach(function (hme) {
        if (hme._id === id) {
          home = hme;
        }
      });
      return !home ? AppHome.get({id: id}) : home;
    }
  };
});
