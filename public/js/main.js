$(function initializeMap (){

  var fullstackAcademy = new google.maps.LatLng(40.705086, -74.009151);

  var styleArr = [{
    featureType: 'landscape',
    stylers: [{ saturation: -100 }, { lightness: 60 }]
  }, {
    featureType: 'road.local',
    stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
  }, {
    featureType: 'transit',
    stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
  }, {
    featureType: 'administrative.province',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'water',
    stylers: [{ visibility: 'on' }, { lightness: 30 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
  }];

  var mapCanvas = document.getElementById('map-canvas');

  var currentMap = new google.maps.Map(mapCanvas, {
    center: fullstackAcademy,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styleArr
  });

  var iconURLs = {
    hotel: '/images/lodging_0star.png',
    restaurant: '/images/restaurant.png',
    activity: '/images/star-3.png'
  };

  var markers = {};

  function drawMarker (type, coords, name) {
    var latLng = new google.maps.LatLng(coords[0], coords[1]);
    var iconURL = iconURLs[type];
    var marker = new google.maps.Marker({
      icon: iconURL,
      position: latLng
    });
    markers[name] = marker;
    marker.setMap(currentMap);
  }

  $('#hotel-choices').siblings('button').on('click', function() {
    var selectedHotel = $(this).siblings('select').val();
    $('#itinerary div:nth-child(1) ul').append('<div class="itinerary-item"><span class="title">' + selectedHotel + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
    drawMarker('hotel', findHotelCoords(selectedHotel), selectedHotel);
  });



  function findHotelCoords(name) {
    for (var i=0; i<hotels.length; i++) {
      if (hotels[i].name === name) {
        return hotels[i].place.location;
      }
    }
  }

  $('#restaurant-choices').siblings('button').on('click', function() {
    var selectedRestaurant = $(this).siblings('select').val();
    $('#itinerary div:nth-child(2) ul').append('<div class="itinerary-item"><span class="title">' + selectedRestaurant + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
    drawMarker('restaurant', findRestaurantCoords(selectedRestaurant), selectedRestaurant);
  });

  function findRestaurantCoords(name) {
    for (var i=0; i<restaurants.length; i++) {
      if (restaurants[i].name === name) {
        return restaurants[i].place.location;
      }
    }
  }

  $('#activity-choices').siblings('button').on('click', function() {
    var selectedActivity = $(this).siblings('select').val();
    $('#itinerary div:nth-child(3) ul').append('<div class="itinerary-item"><span class="title">' + selectedActivity + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
    drawMarker('activity', findActivityCoords(selectedActivity), selectedActivity);
    });

  function findActivityCoords(name) {
    for (var i=0; i<activities.length; i++) {
      if (activities[i].name === name) {
        return activities[i].place.location;
      }
    }
  }

  $('#itinerary .list-group').on('click', 'button', function() {
    var name = $(this).siblings('span').text();
    $(this).parent('div').remove();
    markers[name].setMap(null);

  })

});
