//basemap tiles (mapbox sat)
var mapTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v4/danswick.lff6ij2d/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGFuc3dpY2siLCJhIjoieUZiWmwtVSJ9.0cPQywdbPVmvHiHJ6NwdXA', {
      attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>",
      maxZoom: 17,
});



// ======= SWAP OUT THE FILENAME BELOW FOR YOUR FILE ======= //
 var yourFilePath = "js/LM.json";

// --------------------------------------------------------- //




// ==== OR CONSTRUCT ONE HERE AND SWAP THE VARIABLE NAME === //
var yourGeoJson = [{
  "type": "Feature",
  "properties": {
    "name": "Delta West",
    "floor": "12"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-87.626867, 41.886493]
  }
}, {
  "type": "Feature",
  "properties": {
    "name": "Delta East",
    "floor": "B"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-84.560646, 42.726780]
  }
}];

var geojson = L.geoJson(yourGeoJson);

// --------------------------------------------------------- //




// ================ INITIALIZE THE MAP ===================== //
var map = L.map('map').fitBounds(geojson.getBounds());


// ================= ADD LAYERS TO THE MAP ================ //
mapTiles.addTo(map);
geojson.addTo(map);

$.getJSON(yourFilePath, function(data){ // USE JQUERY TO MAKE HTTP REQUEST FOR EXTERNAL FILE
  // check for var with file path
  if (yourFilePath != "undefined") {
    var passedJson = L.geoJson(data);
    passedJson.addTo(map);
  }
});
