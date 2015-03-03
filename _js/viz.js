var m = [35, 35, 35, 45]; // margins
var w = 1000 - m[1] - m[3]; // width
var h = 600 - m[0] - m[2]; // height
var x, y, y1, y2;

var kravish = [
["40:00","34:40"],
["33:45","21:15"],
["20:00","11:59"],
["11:07","0:00"]];

var svg = d3.select("#viz").append("svg:svg")
      .attr("width", w + m[1] + m[3])
      .attr("height", h + m[0] + m[2])
      .attr('id', 'graph1');


$(document).ready(function() {
  // $.each(fullgame, function(i,d) {
  //   if (d.text.search("Kravish") != -1) {
  //     processPlay(d);
  //   }
  //   else {
  //     d.event = '';
  //   }
  // })
});

x = d3.scale.linear().domain([0, 2400]).range([0, w]);
y = d3.scale.linear().domain([-20, 20]).range([h, 0]);
var xAxis = d3.svg.axis().scale(x).ticks(0).tickSize(0,0);
var yAxisLeft = d3.svg.axis().scale(y).ticks(0).tickSize(0,0).tickValues([0,25,50,75,100]).orient("left");

svg.append("svg:g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + h/2 + ")")
      .call(xAxis);

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
	return (time_to_x(d[0]) / 2400.0) * w
})
.attr('y', function(d) {
	return 0;
})
.attr('height', h)
.attr('width', function(d) {
	return w * (time_to_x(d[1]) - time_to_x(d[0]))/2400.0
})
.attr('class', 'playerbox');

// halftime line
svg.append("line")
	.attr({
	  "x1": w/2,
	  "y1": 0,
	  "x2": w/2,
	  "y2": h,
	  'class': 'halftimeLine'
});

var line = d3.svg.line()
      .x(function(d) {
        return x(time_to_x(d.time));
      })
      .y(function(d) {
        return y(d.margin);
      })
      .interpolate("monotone");

svg.append('path')
  .datum(fullgame)
  .attr('class','line')
  .attr("d",line);


var bars = svg.selectAll('g')
            .data(fullgame)
            .enter()
            .append('g')

bars.append('rect')
      .attr({
        width:1,
        height: function(d) {
          if (d.text.search("Kravish") != -1)
            return y(d.margin) - (h/2);
          else
            return y(0) - (h/2);
        },
        x: function(d) {
          return x(time_to_x(d.time));
        },
        y: function(d) {
          return h - y(d.margin);
        },
        class: function(d) {
          if (d.text.search("Kravish") != -1)
            return "kravish";
        }
      })
      .on("mouseover", function(d) {
        console.log(d.time+" - "+d.text);
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
function time_to_x(timestr) {
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

// function processPlay(d) {

//   if (d.text.search('made Jumper'))
//     d.

// }






