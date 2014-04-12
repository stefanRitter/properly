angular.module('app', ['ngResource', 'ngRoute']);

angular.module('app').config(function ($routeProvider, $locationProvider) {
  'use strict';

  var routeRoleChecks = {
    user: {
      auth: ['appAuth', function (appAuth) {
        return appAuth.authorizeLoggedInUserForRoute();
      }]
    }
  };

  $locationProvider.html5Mode(true);

  $routeProvider
    .when('/',        {templateUrl: '/partials/home/home',      controller: 'appHomeCtrl'})
    .when('/login',   {templateUrl: '/partials/account/login',  controller: 'appLoginCtrl'})
    .when('/join',    {templateUrl: '/partials/account/join',   controller: 'appJoinCtrl'})
    .when('/verify',  {templateUrl: '/partials/account/verify', controller: 'appVerifyCtrl'})
    .when('/map',     {templateUrl: '/partials/map/map',        controller: 'appMapCtrl'})
    
    .when('/pro',           {templateUrl: '/partials/pro/pro',        controller: 'appProCtrl'})
    .when('/pro/dashboard', {templateUrl: '/partials/pro/dashboard',  controller: 'appProDashboardCtrl'})
    
    .when('/home/:id',       {templateUrl: '/partials/property/show', controller: 'appPropertyShowCtrl'})
    .when('/home/:id/edit',  {templateUrl: '/partials/property/edit', controller: 'appPropertyEditCtrl'})

    .when('/saved', {templateUrl: '/partials/saved/saved', controller: 'appSavedCtrl',
      resolve: routeRoleChecks.user})
    .when('/account/settings', {templateUrl: '/partials/account/settings', controller: 'appSettingsCtrl',
      resolve: routeRoleChecks.user});
});

angular.module('app').run(function ($rootScope, $location) {
  'use strict';

  $rootScope.$on('$routeChangeError', function (event, current, previous, rejectionReason) {
    if (rejectionReason === 'not authorized') {
      $location.path('/');
    }
  });
});
