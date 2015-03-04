var m = [35, 35, 35, 45]; // margins
var w = 1000 - m[1] - m[3]; // width
var h = 600 - m[0] - m[2]; // height
var x, y, y1, y2;

var kravish = [
["40:00","34:40"],
["33:45","21:15"],
["20:00","11:59"],
["11:07","0:00"]];

var playerevents = [
  {
    time: "39:00",
    type: 1
  },
  {
    time: "35:00",
    type: 1
  },
  {
    time: "30:00",
    type: 2
  },
  {
    time: "29:00",
    type: 3
  },
  {
    time: "9:00",
    type: 3
  },
];


var svg = d3.select("#viz").append("svg:svg")
      .attr("width", w + m[1] + m[3])
      .attr("height", h + m[0] + m[2])
      .attr('id', 'graph1');


$(document).ready(function() {
});


// draw axes
x = d3.scale.linear().domain([0, 2400]).range([0, w]);
y = d3.scale.linear().domain([-100, 100]).range([h, 0]);
var xAxis = d3.svg.axis().scale(x).ticks(0).tickSize(0,0);
var yAxisLeft = d3.svg.axis().scale(y).ticks(0).tickSize(0,0).tickValues([0,25,50,75,100]).orient("left");

// x axis
svg.append("svg:g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + h/2 + ")")
      .call(xAxis);

// y axis
svg.append("svg:g")
      .attr("class", "y y1 axis")
      .attr("transform", "translate(0,0)")
      .call(yAxisLeft);


// add player on-court overlay
svg.selectAll('.playerbox').remove();
svg.selectAll('.playerbox')
.data(kravish)
.enter()
.append('rect')
.attr('x', function(d) {
	return (time_to_elapsed_secs(d[0]) / 2400.0) * w
})
.attr('y', function(d) {
	return 0;
})
.attr('height', h)
.attr('width', function(d) {
	return w * (time_to_elapsed_secs(d[1]) - time_to_elapsed_secs(d[0]))/2400.0
})
.attr('class', 'playerbox');

// add events
svg.selectAll('.playerevents').remove();
svg.selectAll('.playerevents')
.data(playerevents)
.enter()
.append('circle')
  .attr('cx',function(d){
    return w* time_to_elapsed_secs(d.time)/2400;
  })
  .attr('cy',function(d){
    return (h/2)-15;
  })
  .attr('r', function(d){
    return 4;
  })
  .attr('class', 'playerevents');


// halftime line
svg.append("line")
	.attr({
	  "x1": w/2,
	  "y1": 0,
	  "x2": w/2,
	  "y2": h,
	  'class': 'halftimeLine'
});

// x axis labels
svg.append("text")
  .attr("class", "axislabel timetext")
  .attr("text-anchor", "middle")
  .attr("x", 20)
  .attr("y", h/2 + 15)
  .text("20:00");
svg.append("text")
  .attr("class", "axislabel timetext")
  .attr("text-anchor", "middle")
  .attr("x", w/4 + 20)
  .attr("y", h/2 + 15)
  .text("10:00");
svg.append("text")
  .attr("class", "axislabel timetext")
  .attr("text-anchor", "middle")
  .attr("x", w/2+20)
  .attr("y", h/2 + 15)
  .text("20:00");
svg.append("text")
  .attr("class", "axislabel timetext")
  .attr("text-anchor", "middle")
  .attr("x", 3*w/4 + 20)
  .attr("y", h/2 + 15)
  .text("10:00");


// # of seconds elapsed from the beginning of the game.
function time_to_elapsed_secs(timestr) {
	timesplit = timestr.split(":");
	timeseconds = timesplit[0] * 60 + Number(timesplit[1]);
	return 2400 - timeseconds;
}

// x = d3.scale.linear().domain([0, alldata.length]).range([0, w]);
// y = d3.scale.linear().domain([0, 100]).range([fh, 0]);

// var line = d3.svg.line()
// .x(function(d,i) { 
//   return x(i);
// })
// .y(function(d) { 
//   // scale is a % of the max 0.6977672 (caltrain at townsend and 4th)
//   return y((d.s[stationindex].s / .6977672)*100); 
// })
