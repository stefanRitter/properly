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

  var bluePin = new google.maps.MarkerImage('http://www.creare.co.uk/wp-content/uploads/2013/08/marker.png',
      null, null, null, new google.maps.Size(40,52));
  // var redPin = new google.maps.MarkerImage('/img/redPin.png', null, null, null, new google.maps.Size(40,52));

  function init(element) {
    var mapOptions = {
      zoom: 13,
      minZoom: 12,
      maxZoom: 20,
      zoomControl: false, // true to use zoomControlOptions below, false to remove all zoom controls.
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.DEFAULT // Change to SMALL to force just the + and - buttons.
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

  function setMarker() {
    var marker = new google.maps.Marker({
      position: latLang,
      icon: bluePin,
      map: map
    });
    
    var infowindow = new google.maps.InfoWindow({
      content: '<h3>Snowdown Summit Cafe</h3><p>Railway Drive-through available.</p>'
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker);
    });
  }

  return {
    restrict: 'A',
    replace: false,
    priority: 1000,
    controller: ['$scope', '$element', function($scope, $element) {
      init($element[0]);
      setMarker();

      $scope.$on('appMapSetCenter', function(e, data) {
        map.setCenter(new google.maps.LatLng(data.lat, data.lng));
        map.setZoom(16);
      });
      
      $scope.$on('appMapSetMarker', function(e, data) {
        setMarker(data);
      });
    }]
  };
});
