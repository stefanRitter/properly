angular.module('app', ['ngResource', 'ngRoute']);

angular.module('app').config(function ($routeProvider, $locationProvider) {
  'use strict';

  var routeRoleChecks = {
    admin: {
      auth: ['appAuth', function (appAuth) {
        return appAuth.authorizeCurrentUserForRoute('admin');
      }]
    }
  };

  $locationProvider.html5Mode(true);

  $routeProvider
    .when('/admin/users', {templateUrl: '/partials/admin/users',
      controller: 'appAdminUsersCtrl', resolve: routeRoleChecks.admin});
});

angular.module('app').run(function ($rootScope, $location) {
  'use strict';

  $rootScope.$on('$routeChangeError', function (event, current, previous, rejectionReason) {
    if (rejectionReason === 'not authorized') {
      $location.path('/');
    }
  });
});
;angular.module('app').factory('AppUser', function ($resource, $rootScope) {
  'use strict';

  var UserResource = $resource('/api/users/:id', {_id: '@id'}, {
    update: { method: 'PUT', isArray: false }
  });

  UserResource.prototype.isAdmin = function() {
    return this.roles && this.roles.indexOf('admin') > -1;
  };

  UserResource.prototype.addBuzzr = function(topic) {
    if (this.buzzrs.indexOf(topic) === -1) {
      this.buzzrs.push(topic);
      this.$update();
      $rootScope.$broadcast('buzzrsChanged');
    }
  };

  UserResource.prototype.removeBuzzr = function(topic) {
    var i = this.buzzrs.indexOf(topic);
    if (i > -1) {
      this.buzzrs.splice(i,1);
      this.$update();
      $rootScope.$broadcast('buzzrsChanged');
    }
  };

  UserResource.prototype.saveLink = function(newSavedLink) {
    this.recordActivity('saved', newSavedLink.url, newSavedLink.topic);
    this.readlater.push(newSavedLink);
    this.$update();
    $rootScope.$broadcast('readlaterChanged');
  };

  UserResource.prototype.removeSavedLink = function(url) {
    var index = -1;
    this.readlater.forEach(function(link, i) {
      if (link.url === url) {
        index = i;
      }
    });

    if (index > -1) {
      this.readlater.splice(index,1);
      this.$update();
      $rootScope.$broadcast('readlaterChanged');
    }
  };

  UserResource.prototype.removeLink = function(url, topic) {
    this.recordActivity('removed', url, topic);
    this.$update();
    $rootScope.$broadcast('removedLink');
  };

  UserResource.prototype.trackView = function(url, topic) {
    this.recordActivity('viewed', url, topic);
    this.$update();
  };

  UserResource.prototype.trackShare = function(url, topic) {
    this.recordActivity('shared', url, topic);
    this.$update();
  };

  UserResource.prototype.recordActivity = function(type, url, topic) {
    var index = -1;
    this.activities.forEach(function(obj, i) {
      if (obj.topic === topic) {
        index = i;
      }
    });
    
    if (index === -1) {
      this.activities.push({
        topic: topic,
        removed: [],
        viewed: [],
        saved: [],
        shared:[]
      });
      index = 0;
    }
    this.activities[index][type].push(url);
  };

  return UserResource;
});
;angular.module('app').factory('appAuth', function ($http, $q, $rootScope, appIdentity, AppUser) {
  'use strict';

  return {
    authenticateUser: function(email, password) {
      var dfd = $q.defer();

      $http
        .post('/login', {email: email, password: password})
        .then(function(res) {
          if (res.data.success) {
            var user = new AppUser();
            angular.extend(user, res.data.user);
            appIdentity.currentUser = user;
            dfd.resolve(true);
          } else {
            dfd.resolve(false);
          }
        });

      return dfd.promise;
    },

    createUser: function(newUserData) {
      var newUser = new AppUser(newUserData);
      var dfd = $q.defer();

      newUser.$save().then(function() {
        appIdentity.currentUser = newUser;
        dfd.resolve(true);
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },

    updateCurrentUser: function(updatedUser) {
      var dfd = $q.defer();

      updatedUser.$update().then(function() {
        appIdentity.currentUser = updatedUser;
        dfd.resolve(true);
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },

    logoutUser: function() {
      var dfd = $q.defer();

      $http
        .post('/logout', {logout: true})
        .then(function() {
          appIdentity.currentUser = undefined;
          dfd.resolve(true);
        });

      return dfd.promise;
    },

    authorizeCurrentUserForRoute: function(role) {
      if (appIdentity.isAuthorized(role)) {
        return true;
      }
      return $q.reject('not authorized');
    },

    authorizeLoggedInUserForRoute: function() {
      if (appIdentity.isAuthenticated()) {
        return true;
      }
      return $q.reject('not authorized');
    }
  };
});;angular.module('app').factory('appIdentity', function ($window, $location, AppUser) {
  'use strict';

  var appIdentity = {
    currentUser: undefined,
    
    isAuthenticated: function() {
      return !!this.currentUser;
    },
    
    isAuthorized: function(role) {
      return !!this.currentUser && this.hasRole(role);
    },
    
    hasRole: function(role) {
      return this.currentUser.isAdmin() || this.currentUser.roles.indexOf(role) > -1;
    }
  };


  if (!!$window.bootstrappedUser) {
    var currentUser = new AppUser();
    angular.extend(currentUser, $window.bootstrappedUser);
    appIdentity.currentUser = currentUser;
  }

  return appIdentity;
});
;angular.module('app').controller('appJoinCtrl', function ($scope, $location, appAuth, appNotifier) {
  'use strict';

  $scope.signup = function() {
    var newUserData = {
      email: $scope.email,
      password: $scope.password
    };

    appAuth.createUser(newUserData).then(function() {
      $location.path('/verify');
    }, function(reason) {
      appNotifier.error(reason, $scope);
    });
  };
});
;angular.module('app').controller('appLoginCtrl', function ($scope, $location, appAuth, appNotifier, appIdentity) {
  'use strict';

  $scope.signin = function() {
    appAuth
      .authenticateUser($scope.email, $scope.password)
      .then(function(success) {
        if (success) {
          if (appIdentity.hasRole('pro')) {
            $location.path('/pro/dashboard');
          } else {
            $location.path('/map');
          }
        } else {
          appNotifier.error('email/password combination incorrect', $scope);
        }
      });
  };
});
;angular.module('app').controller('appSettingsCtrl', function ($scope, $location, appAuth, appIdentity, appNotifier) {
  'use strict';

  $scope.currentUser = angular.copy(appIdentity.currentUser);
  $scope.email = {
    valid: appIdentity.currentUser.email.match(/^[\S]+@[\S]+\.[\S]+$/)
  };

  $scope.update = function() {
    appAuth.updateCurrentUser($scope.currentUser).then(function() {
      if (!$scope.email.valid) { return $location.path('/'); }
      appNotifier.notify('Your account has been updated', $scope);
    }, function(reason) {
      appNotifier.error(reason, $scope);
    });
  };
});
;angular.module('app').controller('appVerifyCtrl', function ($scope) {
  'use strict';

  $scope.verify = function() {
    window.alert();
  };
});
;angular.module('app').controller('appAdminUsersCtrl', function ($scope, AppUser) {
  'use strict';
  
  $scope.users = AppUser.query();
});;/**
 * Checklist-model
 * AngularJS directive for list of checkboxes
 * http://vitalets.github.io/checklist-model/
 */

angular.module('app').directive('checklistModel', ['$parse', '$compile', function($parse, $compile) {
  'use strict';

  // contains
  function contains(arr, item) {
    if (angular.isArray(arr)) {
      for (var i = 0; i < arr.length; i++) {
        if (angular.equals(arr[i], item)) {
          return true;
        }
      }
    }
    return false;
  }

  // add
  function add(arr, item) {
    arr = angular.isArray(arr) ? arr : [];
    for (var i = 0; i < arr.length; i++) {
      if (angular.equals(arr[i], item)) {
        return arr;
      }
    }
    arr.push(item);
    return arr;
  }

  // remove
  function remove(arr, item) {
    if (angular.isArray(arr)) {
      for (var i = 0; i < arr.length; i++) {
        if (angular.equals(arr[i], item)) {
          arr.splice(i, 1);
          break;
        }
      }
    }
    return arr;
  }

  // http://stackoverflow.com/a/19228302/1458162
  function postLinkFn(scope, elem, attrs) {
    // compile with `ng-model` pointing to `checked`
    $compile(elem)(scope);

    // getter / setter for original model
    var getter = $parse(attrs.checklistModel);
    var setter = getter.assign;

    // value added to list
    var value = $parse(attrs.checklistValue)(scope.$parent);

    // watch UI checked change
    scope.$watch('checked', function(newValue, oldValue) {
      if (newValue === oldValue) {
        return;
      }
      var current = getter(scope.$parent);
      if (newValue === true) {
        setter(scope.$parent, add(current, value));
      } else {
        setter(scope.$parent, remove(current, value));
      }
    });

    // watch original model change
    scope.$parent.$watch(attrs.checklistModel, function(newArr) {
      scope.checked = contains(newArr, value);
    }, true);
  }

  return {
    restrict: 'A',
    priority: 1000,
    terminal: true,
    scope: true,
    compile: function(tElement, tAttrs) {
      if (tElement[0].tagName !== 'INPUT' || !tElement.attr('type', 'checkbox')) {
        throw 'checklist-model should be applied to `input[type="checkbox"]`.';
      }

      if (!tAttrs.checklistValue) {
        throw 'You should provide `checklist-value`.';
      }

      // exclude recursion
      tElement.removeAttr('checklist-model');
      
      // local scope var storing individual checkbox model
      tElement.attr('ng-model', 'checked');

      return postLinkFn;
    }
  };
}]);;angular.module('app').factory('appIsMobile', function() {
  'use strict';

  var isMobile = {
    Android: function() {
      return navigator.userAgent.match(/Android/i) ? true : false;
    },
    BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    Windows: function() {
      return navigator.userAgent.match(/IEMobile/i) ? true : false;
    },
    any: function() {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
    }
  };
  
  return isMobile;
});
;angular.module('app').factory('appNotifier', function() {
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
;angular.module('app').factory('appTopics', function ($window) {
  'use strict';

  var topics = [];
  
  if (!!$window.bootstrappedTopics) {
    topics = $window.bootstrappedTopics;
  }

  return topics;
});
;angular.module('app').factory('appFeedback', function ($rootScope) {
  'use strict';

  return {
    toggle: function() {
      $rootScope.$broadcast('toggleFeedback');
    }
  };
});
;angular.module('app').controller('appFeedbackCtrl', function ($scope, $location, $window, $http, appIdentity, appNotifier) {
  'use strict';

  $scope.success = false;
  $scope.show = false;

  $scope.feedback = {};
  $scope.feedback.userAgent = $window.navigator.userAgent;
  
  if (appIdentity.isAuthenticated()) {
    $scope.feedback.name = appIdentity.currentUser.name;
    $scope.feedback.email = appIdentity.currentUser.email;
  }

  $scope.send = function() {
    $scope.feedback.currentPath = $location.path();
    
    $http
      .post('/api/feedback', $scope.feedback)
      .then(function(res) {
        if (res.data.success) {
          $scope.success = true;
        } else {
          appNotifier.error(res.data.err || 'unknown error', $scope);
        }
      }, function(res) {
        appNotifier.error('error ' + res.status +
          ' occurred - please email help@buzzr.io', $scope);
      });
  };

  $scope.toggle = function () {
    $scope.show = !$scope.show;
  };

  $scope.$on('toggleFeedback', function() {
    $scope.toggle();
  });
});
;angular.module('app').controller('appHeaderCtrl', function ($scope, $location, appIdentity, appAuth) {
  'use strict';
  
  $scope.onPath = function() {
    for (var i = 0, len = arguments.length; i < len; i++) {
      if (arguments[i] === $location.path()) {
        return true;
      }
    }
  };

  $scope.isLoggedIn = function(role) {
    if (role) { return appIdentity.isAuthorized(role); }
    return appIdentity.isAuthenticated();
  };

  $scope.signout = function() {
    appAuth.logoutUser().then(function() {
      $location.path('/');
    });
  };

  $scope.toggleDropdown = function() {
    $scope.openDropdown = !$scope.openDropdown;
  };
});
;angular.module('app').factory('AppHome', function ($resource) {
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
});;angular.module('app').controller('appHomeEditCtrl', function ($scope, $location, $routeParams, appCachedHome, appGeocoder) {
  'use strict';

  var steps = ['basic', 'details', 'description', 'pictures', 'contact'];

  $scope.id = $routeParams.id;
  $scope.step = $routeParams.step;
  $scope.home = appCachedHome.get($scope.id);

  $scope.getStep = function() {
    return '/partials/homes/edit/' + $scope.step;
  };

  $scope.nextStep = function(step) {
    appCachedHome.set($scope.home);
    $location.path('/pro/home/'+$scope.id+'/'+step);
  };

  $scope.activeStep = function(step) {
    return step === $scope.step;
  };

  $scope.verify = function() {
    var next = steps.indexOf($scope.step) + 1;
    $scope.home.$save().then(function() {
      appCachedHome.set($scope.home);
      $location.path('/pro/home/'+$scope.home._id+'/'+steps[next%steps.length]);
    
    }, function (response) {
      window.alert('Sorry there was an unexpected server error! Please contact us for help if this happens again.');
      console.log(response);
    });
  };

  $scope.geocode = function() {
    var address = $scope.home.address+','+$scope.home.postcode+', London UK';
    appGeocoder.geocode(address).then(function(res) {
      $scope.home.loc = [res.lat, res.lng];
    });
  };
});
;angular.module('app').controller('appHomeShowCtrl', function ($scope, $routeParams) {
  'use strict';

  $scope.id = $routeParams.id;
});
;angular.module('app').controller('appIndexCtrl', function ($scope, $location, $anchorScroll) {
  'use strict';
  $anchorScroll();
  $scope.gotoAbout = function() {
    $location.hash('about');
  };
});
;angular.module('app').value('appGoogle', window.google);

angular.module('app').factory('appMapObject', function () {
  'use strict';
  var map = {};
  return {
    set: function(newMap) {
      map = newMap;
    },
    get: function() {
      return map;
    }
  };
});

angular.module('app').directive('googleMap', function (appGoogle, appMapObject, appIsMobile) {
  'use strict';

  var google = appGoogle,
      latLang = new google.maps.LatLng(51.5096283,-0.1114692),
      map;

  var bluePin = new google.maps.MarkerImage('http://www.creare.co.uk/wp-content/uploads/2013/08/marker.png',
      null, null, null, new google.maps.Size(40,52));
  // var redPin = new google.maps.MarkerImage('/img/redPin.png', null, null, null, new google.maps.Size(40,52));

  function init(element) {
    var mapOptions = {
      zoom: 13,
      minZoom: 12,
      maxZoom: 20,
      zoomControl: true, // Set to true if using zoomControlOptions below, or false to remove all zoom controls.
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.DEFAULT // Change to SMALL to force just the + and - buttons.
      },
      center: latLang,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: !appIsMobile.any(), // Disable Mouse Scroll zooming on mobile
     
      // All of the below are set to true by default, so simply remove if set to true:
      panControl: false, // Set to false to disable
      mapTypeControl: false, // Disable Map/Satellite switch
      scaleControl: false, // Set to false to hide scale
      streetViewControl: false, // Set to disable to hide street view
      overviewMapControl: false, // Set to false to remove overview control
      rotateControl: false // Set to false to disable rotate control
    };

    map = new google.maps.Map(element, mapOptions);
    appMapObject.set(map);
  }

  function setMarker() {
    var marker = new google.maps.Marker({
      position: latLang,
      icon: bluePin,
      map: map,
      title: 'new home?'
    });
    
    var infowindow = new google.maps.InfoWindow({ // Create a new InfoWindow
      content: '<h3>Snowdown Summit Cafe</h3><p>Railway Drive-through available.</p>' // HTML contents of the InfoWindow
    });

    google.maps.event.addListener(marker, 'click', function() { // Add a Click Listener to our marker
      infowindow.open(map, marker); // Open our InfoWindow
    });
  }

  return {
    restrict: 'A',
    replace: false,
    priority: 1000,
    controller: ['$element', '$scope', function($element) {
      init($element[0]);
      setMarker();
    }]
  };
});
;angular.module('app').controller('appMapCtrl', function ($scope) {
  'use strict';

  $scope.map = {};
});
;angular.module('app').factory('appGeocoder', function (appGoogle, $q) {
  'use strict';
  
  var google = appGoogle,
      geocoder = new google.maps.Geocoder();
  
  function geocode(stringAddress) {
    var dfd = $q.defer();
    geocoder.geocode( {'address': stringAddress}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        var coords = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };
        dfd.resolve(coords);
      } else {
        window.alert('Geocode was not successful for the following reason: ' + status);
      }
    });
    return dfd.promise;
  }

  return {
    geocode: geocode
  };
});;angular.module('app').factory('appSearch', function () {
  'use strict';

});
;angular.module('app').controller('appProCtrl', function ($scope, $location, appAuth, appNotifier) {
  'use strict';

  $scope.signup = function() {
    var newUserData = {
      email: $scope.email,
      password: $scope.password,
      roles: ['pro']
    };

    appAuth.createUser(newUserData).then(function() {
      $location.path('/pro/dashboard');
    }, function(reason) {
      appNotifier.error(reason, $scope);
    });
  };
});
;angular.module('app').controller('appProDashboardCtrl', function ($scope, appIdentity) {
  'use strict';

  $scope.homes = appIdentity.currentUser.homes || [];

  $scope.hasHome = function() {
    return $scope.homes.length > 0;
  };
});
;angular.module('app').controller('appProfileEditCtrl', function ($scope) {
  'use strict';

  $scope.id = 0;
});
;angular.module('app').controller('appProfileShowCtrl', function ($scope) {
  'use strict';

  $scope.id = 0;
});
;angular.module('app').controller('appSavedCtrl', function ($scope) {
  'use strict';

  $scope.readlater = [];
});
