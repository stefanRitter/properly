angular.module('app').value('appGoogle', window.google);

angular.module('app').factory('appMap', function ($rootScope) {
  'use strict';

  return {
    setCenter: function(latLang) {
      $rootScope.$broadcast('appMapSetCenter', latLang);
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
    controller: ['$scope', '$element', function($scope, $element) {
      init($element[0]);
      setMarker();

      $scope.$on('appMapSetCenter', function(e, data) {
        map.setCenter(new google.maps.LatLng(data.lat, data.lng));
        map.setZoom(16);
      });
    }]
  };
});
