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
  var bounds = new google.maps.LatLngBounds();

  function drawMarker (type, coords, name, day) {
    var latLng = new google.maps.LatLng(coords[0], coords[1]);
    var iconURL = iconURLs[type];
    var marker = new google.maps.Marker({
      icon: iconURL,
      position: latLng
    });
    days[day].markers[name] = marker;
    marker.setMap(currentMap);
    bounds.extend(marker.position);
    currentMap.fitBounds(bounds);
  }


  var days = [{hotels: [], restaurants:[], activities: [], markers: markers}];

  $('#hotel-choices').siblings('button').on('click', function() {
    var selectedHotel = $(this).siblings('select').val();
    var itemHtml = '<div class="itinerary-item"><span class="title">' + selectedHotel + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
    var dayInd = +($('.current-day').text())-1;
    days[dayInd].hotels.push(itemHtml);
    $('#itinerary div:nth-child(1) ul').append(itemHtml);
    drawMarker('hotel', findHotelCoords(selectedHotel), selectedHotel, dayInd);
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
    var itemHtml = '<div class="itinerary-item"><span class="title">' + selectedRestaurant + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
    var dayInd = +($('.current-day').text())-1;
    days[dayInd].restaurants.push(itemHtml);
    $('#itinerary div:nth-child(2) ul').append(itemHtml);
    drawMarker('restaurant', findRestaurantCoords(selectedRestaurant), selectedRestaurant, dayInd);
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
    var itemHtml = '<div class="itinerary-item"><span class="title">' + selectedActivity + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
    var dayInd = +($('.current-day').text())-1;
    days[dayInd].activities.push(itemHtml);
    $('#itinerary div:nth-child(3) ul').append(itemHtml);
    drawMarker('activity', findActivityCoords(selectedActivity), selectedActivity, dayInd);
    });

  function findActivityCoords(name) {
    for (var i=0; i<activities.length; i++) {
      if (activities[i].name === name) {
        return activities[i].place.location;
      }
    }
  }

  //removing an itinerary item
  $('#itinerary .list-group').on('click', 'button', function() {
    var name = $(this).siblings('span').text();
    var group = $(this).parent().parent() .siblings('h4').text().toLowerCase().split(" ")[1];
    if (group === 'hotel') group = 'hotels';
    $(this).parent('div').remove();
    var dayInd = $('.current-day').text()-1;
    days[dayInd].markers[name].setMap(null);

    var ind;

    days[dayInd][group].forEach(function(value, index) {
      if (value.indexOf(name) > -1) {
        ind = index;
      }
    });

    days[dayInd][group].splice(ind, 1);
    delete days[dayInd].markers[name];

  });

  //adding a day
  $('#day-add').on('click', function() {
    var currNum = +($(this).prev().text()) + 1;
    $(this).before('<button class="btn btn-circle day-btn">' + currNum + '</button>');
    days.push({hotels: [], restaurants:[], activities: [], markers: {}});
  });

  //switching days
  $('.day-buttons').on('click', 'button:not(:last-child)', function() {
    var dayNum = $(this).text();
    switchToDay(dayNum);
    $(this).addClass('current-day');
  })


  function switchToDay(dayNum) {
    $('.list-group').empty();

    var prevDayInd = $('.current-day').text()-1;

    //remove map markers
    for(var key in days[prevDayInd].markers) {
      days[prevDayInd].markers[key].setMap(null);
    }

    //re-add all itinerary items to DOM
    for (var key in days[dayNum-1]) {
      if (key === 'markers') {
        break;
      }
      days[dayNum-1][key].forEach(function(value) {
        if(key === 'hotels') {
          $('#itinerary div:nth-child(1) ul').append(value);
        }
        else if (key === 'restaurants') {
          $('#itinerary div:nth-child(2) ul').append(value);
        }
        else if (key === 'activities') {
          $('#itinerary div:nth-child(3) ul').append(value);
        }
      });
    }

    bounds = new google.maps.LatLngBounds();
    //re-add map markers
    for (var key in days[dayNum-1].markers) {
      days[dayNum-1].markers[key].setMap(currentMap);
      bounds.extend(days[dayNum-1].markers[key].position);
    }
    currentMap.fitBounds(bounds);

    $('#day-title span').text('Day ' + dayNum);

    $('.current-day').removeClass('current-day');
  }

  //removing a day
  $('#day-title button').on('click', function() {
    var currDay = +($(this).siblings('span').text().split(' ')[1]);
    if (currDay === days.length) {
      switchToDay(currDay-1);
      days.splice(currDay-1, 1);
      var prevDay = currDay-1
      $('.day-buttons button:nth-child('+prevDay+')').addClass('current-day');
      $('.day-buttons button:nth-child('+currDay+')').remove();
    }
    else if (currDay === 1){
      days[0] = {hotels: [], restaurants:[], activities: [], markers: {}};
      switchToDay(currDay);
      $('.day-buttons button:nth-child(1)').addClass('current-day');
    }
    else {
      alert('Sorry, cannot delete day from middle of itinerary!');
    }
  })

});


//{hotels: [], restaurants:[], activities: [], markers: markers}
