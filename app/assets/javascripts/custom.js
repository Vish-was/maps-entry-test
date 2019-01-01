var componentForm = {
  locality: 'long_name',
  sublocality_level_1: 'long_name',
  street_number: 'short_name'
};

// adds a search box to a map, using the Google Place Autocomplete feature.
function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13,
    mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    place = places[0]

    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        document.getElementById(addressType).value = val;
      }
    }

    try{
      var open_hours = place.opening_hours.weekday_text;
    } catch(e){
      var open_hours = "";
    }

    $("#open_hours").val(open_hours);
    document.getElementById('open_hours').value = open_hours;
    // $("#place_city").val(places[0].address_components[3].long_name)

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

// Hide map on page load
$(document).ready(function() {
  var map = $('#pac-input').val();
  if (map == ""){
    $('#map').hide();
    $('#buttons').hide();
  }
});

// Show map on search
$("#pac-input").on( "blur", function() {
  var map = $('#pac-input').val();
  if (map != ""){
    $('#map').show();
    $('#buttons').show();
  }
});

function submitForm() {
 $('#placeForm').submit();
}

$('#click_advance').click(function() {
  $('#display_advance').toggle('1000');
  $("i", this).toggleClass("fas fa-chevron-circle-down fas fa-chevron-circle-up");
});

$("form").on("keypress", function (e) {
  if (e.keyCode == 13) {
    var map = $('#pac-input').val();
    if (map != ""){
      $('#map').show();
      $('#buttons').show();
    }
    return false;
  }
});
