angular.module('app').value('appGoogle', window.google);

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


angular.module('app').directive('appMap', function () {
  'use strict';

  return {
    restrict: 'A',
    replace: false,
    controller: ['$element', 'appGoogle', 'appMapObject', 'appIsMobile', function($element, appGoogle, appMapObject, appIsMobile) {
      var google = appGoogle,
                    map = {},
                    latLang = new google.maps.LatLng(51.5096283,-0.1114692);

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

      console.log($element);
      map = new google.maps.Map($element[0], mapOptions);
      appMapObject.set(map);
    }]
  };
});


angular.module('app').factory('appMapMarker', function (appGoogle) {
  'use strict';
  var google = appGoogle,
      map = {},
      latLang = new google.maps.LatLng(51.5096283,-0.1114692);

  var bluePin = new google.maps.MarkerImage('http://www.creare.co.uk/wp-content/uploads/2013/08/marker.png',
      null, null, null, new google.maps.Size(40,52));
  // var redPin = new google.maps.MarkerImage('/img/redPin.png', null, null, null, new google.maps.Size(40,52));

  var setMarker = function() {
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
  };

  return {
    setMarker: setMarker
  };
});
