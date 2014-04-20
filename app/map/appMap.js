angular.module('app').value('appGoogle', window.google);

angular.module('app').factory('appMap', function ($rootScope) {
  'use strict';

  return {
    setCenter: function(data) {
      $rootScope.$broadcast('appMapSetCenter', data);
    },
    setMarker: function(data) {
      $rootScope.$broadcast('appMapSetMarker', data);
    }
  };
});


angular.module('app').directive('googleMap', function (appGoogle, appIsMobile) {
  'use strict';

  var google = appGoogle,
      latLang = new google.maps.LatLng(51.5096283,-0.1114692),
      map;

  var pinRed = new google.maps.MarkerImage('/img/pin-red.png',
      null, null, null, new google.maps.Size(40,52));
  // var redPin = new google.maps.MarkerImage('/img/redPin.png', null, null, null, new google.maps.Size(40,52));

  function init(element) {
    var mapOptions = {
      zoom: 13,
      minZoom: 12,
      maxZoom: 20,
      zoomControl: false, // true to use zoomControlOptions below, false to remove all zoom controls.
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL // Change to SMALL to force just the + and - buttons.
      },
      center: latLang,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: !appIsMobile.any(), // Disable Mouse Scroll zooming on mobile

      panControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      overviewMapControl: false,
      rotateControl: false
    };

    map = new google.maps.Map(element, mapOptions);
  }

  function setMarker(data) {
    if (data.loc.length !== 2) { return; }
    var loc = new google.maps.LatLng(data.loc[0],data.loc[1]);

    var marker = new google.maps.Marker({
      position: loc,
      icon: pinRed,
      map: map,
      animation: google.maps.Animation.DROP
    });
    
    var infowindow = new google.maps.InfoWindow({
      content: '<div class="home-link" id="'+data._id+'">Click me!</div>'
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker);
    });
  }

  function focusMap(lat, lng) {
    map.setCenter(new google.maps.LatLng(lat, lng));
    map.setZoom(16);
  }

  return {
    restrict: 'A',
    replace: false,
    priority: 1000,
    controller: ['$scope', '$element', '$rootScope', function($scope, $element, $rootScope) {
      init($element[0]);

      if (!!$scope.home.loc) {
        focusMap($scope.home.loc[0], $scope.home.loc[1]);
      }

      $scope.$on('appMapSetCenter', function(e, data) {
        focusMap(data.lat, data.lng);
      });
      
      $scope.$on('appMapSetMarker', function(e, data) {
        setMarker(data);
      });

      $element.on('click', function(e) {
        if (e.target.className !== 'home-link') { return; }
        $rootScope.$broadcast('appShowHome', {_id: e.target.id});
      });
    }]
  };
});
