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
  $locationProvider.hashPrefix('!');


  // public urls - SEO enabled
  $routeProvider
    .when('/',         {templateUrl: '/partials/home/home',      controller: 'appHomeCtrl'})
    .when('/map',      {templateUrl: '/partials/map/map',        controller: 'appMapCtrl'})
    .when('/pro',      {templateUrl: '/partials/pro/pro',        controller: 'appProCtrl'})
    .when('/saved',    {templateUrl: '/partials/saved/saved',    controller: 'appSavedCtrl'})
    .when('/login',    {templateUrl: '/partials/account/login',  controller: 'appLoginCtrl'})
    .when('/join',     {templateUrl: '/partials/account/join',   controller: 'appJoinCtrl'})
    .when('/home/:id', {templateUrl: '/partials/property/show',  controller: 'appPropertyShowCtrl'});
  
  // pro account urls - must be admin or pro user
  $routeProvider
    .when('/pro/dashboard',  {templateUrl: '/partials/pro/dashboard',  controller: 'appProDashboardCtrl'})
    .when('/pro/tenant/:id', {templateUrl: '/partials/profile/show',   controller: 'appProfileShowCtrl'})
    .when('/pro/home/:id',   {templateUrl: '/partials/property/edit',  controller: 'appPropertyEditCtrl'})
    .when('/pro/home/:id',   {templateUrl: '/partials/property/edit',  controller: 'appPropertyEditCtrl'});

  // user urls - must be verified or admin, not pro user
  $routeProvider
    .when('/verify',  {templateUrl: '/partials/account/verify', controller: 'appVerifyCtrl'})
    .when('/account/profile', {templateUrl: '/partials/profile/edit', controller: 'appProfileEditCtrl',
      resolve: routeRoleChecks.user});
  
  // shared urls - must be logged in
  $routeProvider
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
