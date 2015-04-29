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
	$('#openModal').remove();
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

var trailLayer = L.mapbox.featureLayer()
						 .loadURL('data/glacier_trails.geojson')
						 .addTo(map);

// Add custom popups to each point
pointLayer.on('layeradd', function(e) {
	var marker = e.layer,
		feature = marker.feature;

	// Create custom popup content
	var popupContent = '<h3>' + feature.properties.name + '</h3>' + 
						'<p>' + feature.properties.description + '</p>' +
						'<p>' + '<a target="_blank" class="popup" href="' + feature.properties.link + '">link</a>' +
						'<br>' +
						'<img class="popup-image" src="' + feature.properties.imageUrl + '" />';


	// bind popup to markers
	marker.bindPopup(popupContent, {
		closeButton: false,
		minWidth: 450
	});
});

// Add custom popups to each trail
trailLayer.on('layeradd', function(e) {
	var trail = e.layer,
		feature = trail.feature;

	// Create custom popup content
	var popupContent = '<h3>' + feature.properties.NAME + '</h3>' + 
						'<p>' + feature.properties.DESC_SEG + '</p>' +
						'<p>' + "Average slope: " + feature.properties.Avg_Slope + '</p>';


	// bind popup to lines
	trail.bindPopup(popupContent, {
		closeButton: false,
		minWidth: 450
	});

	// set style
	if (feature.properties.evaluating === 'yes') {
		trail.setStyle({
			color: '#B63833',
			weight: 3,
	 		opacity: 0.9,
	 		dashArray: '3'
		});
	} else {
		trail.setStyle({
		 	color: '#921E11',
		 	weight: 1,
		 	opacity: 0.6,
		 	dashArray: '5'
		});
	}
});

// Add features to the map
pointLayer.setGeoJSON(sheetGeoJson);

}


/* - - - - - - - - - - - - - - - - - - - - - - - - 
   D3 ELEVATION PROFILE
   adapted from - http://bl.ocks.org/jonsadka/482005612916b3f5e408
   - - - - - - - - - - - - - - - - - - - - - - - - */
function newData(lineNumber, points){
  return d3.range(lineNumber).map(function(){
    return d3.range(points).map(function(item,idx){
      return {x:idx/(points-1),y:Math.random()*100};
    });
  });
}

function newDataZeroes(lineNumber, points){
	return d3.range(lineNumber).map(function(){
		return d3.range(points).map(function(item,idx){
			return {x:idx/(points-1), y:0};
		});
	});
}

function randomColor() {
	return '#' + Math.floor(Math.random()*16777215).toString(16);
}

var margin = { top: 10, right: 0, bottom: 10, left: 50 };

var width = 800;
var height = 200;

var svg = d3.select('.elev-profile-proto').append('svg')
	.attr("height", height).attr("width", width)
	.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');

var xScale = d3.scale.linear()
	.range([0, width - margin.left - margin.right]);

var yScale = d3.scale.linear()
	.range([height - margin.top - margin.bottom, 0]);

var interpolation = 'Cardinal';

var line = d3.svg.line().interpolate(interpolation)
	.x(function(d){
		return xScale(d.x);
	})
	.y(function(d){
		return yScale(d.y);
	});

var area = d3.svg.area().interpolate(interpolation)
	.x(function(d){
		return xScale(d.x);
	})
	.y0(height - margin.top - margin.bottom)
	.y1(function(d){
		return yScale(d.y);
	});

function render(numGenerator) {
	var newColor = randomColor();
	var shaderColor = 'rgba(0,0,0,0.3)';

	// generate new data
	var data;
	if (numGenerator === 0){
		data = newDataZeroes(1, 15)
	} else {
		data = newData(1,15);
	}

	// get abs min and max 
	var yMin = data.reduce(function(pv, cv) {
		var currentMin = cv.reduce(function(pv,cv){
			return Math.min(pv, cv.y);
		}, 100)
		return Math.min(pv,currentMin);
	}, 100);
	var yMax = data.reduce(function(pv, cv) {
		var currentMax = cv.reduce(function(pv, cv) {
			return Math.max(pv, cv.y);
		}, 0)
		return Math.max(pv, currentMax) + (currentMax * 0.05);
	}, 0);



	// set as domain for axis
	yScale.domain([yMin, yMax]);


	// Axes
	// create axis
	var yAxis = d3.svg.axis().scale(yScale).orient('left');

	if (svg.selectAll('.y.axis')[0].length < 1 ){
		svg.append('g').attr('class', 'y axis').call(yAxis);	
	} else {
		svg.selectAll('.y.axis').transition().duration(1500).call(yAxis);
	}


	// Area
	// draw new lines
	var areas = svg.selectAll('.areas').data(data).attr('class', 'areas');

	// transition from previous paths to new paths
	areas.transition().duration(1500)
		.attr('d', area)
		.style('fill', newColor);

	// enter any new areas
	areas.enter().append('path')
		.attr('class', 'areas')
		.attr('d', area)
		.style('fill', newColor);

	// exit
	areas.exit().remove();


	// Lines
	// draw new lines
	var lines = svg.selectAll('.line').data(data).attr('class', 'line');

	// transition from previous paths to new paths
	lines.transition().duration(1500)
		.attr('d', line)
		.style('stroke', shaderColor);

	// enter any new lines
	lines.enter().append('path')
		.attr('class', 'line')
		.attr('d', line)
		.style('stroke', shaderColor);

	// exit
	lines.exit().remove();
}


render(0);
setInterval(render, 1500);









