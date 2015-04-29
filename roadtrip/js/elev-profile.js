function makeAnElevationProfile(elementID){
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

var width = $('.itinerary-item').width() * 0.8;
var height = 200;

var margin = { top: 20, right: (width * 0.05), bottom: 20, left: (width * 0.05) };

var svg = d3.select(elementID).append('svg')
	.attr("height", height).attr("width", width)
	.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');

var xScale = d3.scale.linear()
	.range([0, width - margin.left - margin.right]);

var yScale = d3.scale.linear()
	.range([height - margin.top - margin.bottom, 0]);

var interpolation = 'linear';

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
setTimeout(render(), 2000);
}








