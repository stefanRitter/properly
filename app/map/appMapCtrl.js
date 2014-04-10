angular.module('app').controller('appMapCtrl', function ($scope) {
  'use strict';
  var google = window.google;

  $scope.map = {};

  var myLatlng = new google.maps.LatLng(51.5096283,-0.1114692); // Add the coordinates
  var mapOptions = {
    zoom: 13, // The initial zoom level when your map loads (0-20)
    minZoom: 13, // Minimum zoom level allowed (0-20)
    maxZoom: 20, // Maximum soom level allowed (0-20)
    zoomControl:true, // Set to true if using zoomControlOptions below, or false to remove all zoom controls.
    zoomControlOptions: {
      style:google.maps.ZoomControlStyle.DEFAULT // Change to SMALL to force just the + and - buttons.
    },
    center: myLatlng, // Centre the Map to our coordinates variable
    mapTypeId: google.maps.MapTypeId.ROADMAP, // Set the type of Map
    scrollwheel: false, // Disable Mouse Scroll zooming (Essential for responsive sites!)
   
    // All of the below are set to true by default, so simply remove if set to true:
    panControl:false, // Set to false to disable
    mapTypeControl:false, // Disable Map/Satellite switch
    scaleControl:false, // Set to false to hide scale
    streetViewControl:false, // Set to disable to hide street view
    overviewMapControl:false, // Set to false to remove overview control
    rotateControl:false // Set to false to disable rotate control
  };
  
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions); // Render our map within the empty div
  
  var image = new google.maps.MarkerImage('http://www.creare.co.uk/wp-content/uploads/2013/08/marker.png', null, null, null, new google.maps.Size(40,52)); // Create a variable for our marker image.
    
  var marker = new google.maps.Marker({ // Set the marker
    position: myLatlng, // Position marker to coordinates
    icon:image, //use our image as the marker
    map: map, // assign the market to our map variable
    title: 'Click to visit our company on Google Places' // Marker ALT Text
  });
  
  var infowindow = new google.maps.InfoWindow({ // Create a new InfoWindow
    content: '<h3>Snowdown Summit Cafe</h3><p>Railway Drive-through available.</p>' // HTML contents of the InfoWindow
  });

  google.maps.event.addListener(marker, 'click', function() { // Add a Click Listener to our marker
    infowindow.open(map,marker); // Open our InfoWindow
  });
  
  google.maps.event.addDomListener(window, 'resize', function() { map.setCenter(myLatlng); }); // Keeps the Pin Central when resizing the browser on responsive sites
});
