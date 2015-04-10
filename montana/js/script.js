// Load the data with Tabletop, the app is in the showInfo callback
var sheetsURL = '1Lujpre-RA5h0UaXnJGADqD_Qays8XZkJoFm2TFX2bh8';
Tabletop.init( { 
	key: sheetsURL, 
	callback: showInfo,
	debug: true, 
	parseNumbers: true, 
	simpleSheet: true
} );

function showInfo(data, tabletop){
//let's put all the data in one variable
	sheetData = data;
	console.log( "Here is your data", sheetData);

	mapFunctions();
}


function mapFunctions() {

var pointFun;
var sheetGeoJson = [];
// for all in sheet array, do some stuff
for ( var i = 0; i < sheetData.length; i++) {
	// create a new object 
	var pointFun = 
		{
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": [sheetData[i].lon, sheetData[i].lat]
			},
			"properties": {
				"name": sheetData[i].name,
				"description": sheetData[i].description,
				"imageUrl": sheetData[i].image,
				"link": sheetData[i].link,
				"marker-color": sheetData[i].markercolor,
				"marker-symbol": sheetData[i].markersymbol
		}
	};

	// push to sheetGeoJson array
	sheetGeoJson.push(pointFun);
	}



// Add empty feature layer to prepare for custom markers

L.mapbox.accessToken = "pk.eyJ1IjoiZGFuc3dpY2siLCJhIjoieUZiWmwtVSJ9.0cPQywdbPVmvHiHJ6NwdXA";
var map = L.mapbox.map('map', 'mapbox.outdoors')
                  .setView([48, -114.014270], 8)
                  /*.featureLayer.setGeoJSON(sheetGeoJson)*/;
var pointLayer = L.mapbox.featureLayer().addTo(map);


// Add custom popups to each
pointLayer.on('layeradd', function(e) {
	var marker = e.layer,
		feature = marker.feature;

	// Create custom popup content
	var popupContent = '<h3>' + feature.properties.name + '</h3>' + 
						'<p>' + feature.properties.description + '</p>' +
						'<p>' + '<a class="popup" href="' + feature.properties.link + '">link</a>' +
						'<br>' +
						'<img class="popup-image" src="' + feature.properties.imageUrl + '" />';


	// bind popup to markers
	marker.bindPopup(popupContent, {
		closeButton: false,
		minWidth: 450
	});
});

// Add features to the map
pointLayer.setGeoJSON(sheetGeoJson);

}

