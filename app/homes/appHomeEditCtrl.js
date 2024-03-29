angular.module('app').controller('appHomeEditCtrl', function ($scope, $location, $routeParams, appCachedHome, appGeocoder, appMap) {
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
    if (!!$scope.geocoding) { return; }
    
    $scope.geocoding = true;
    var address = $scope.home.address+','+$scope.home.postcode+', London UK';
    appGeocoder.geocode(address).then(function(res) {
      $scope.home.loc = [res.lat, res.lng];
      appMap.setCenter(res);
      $scope.geocoding = false;
    });
  };
});
