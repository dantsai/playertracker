var m = [35, 35, 35, 45]; // margins
var w = 1200 - m[1] - m[3]; // width
var h = 280 - m[0] - m[2]; // height
var x, y, y1, y2;
var lineHeight = 20;

$.each(fullgame, function(i,d) {
  // if (d.text.search("Kravish") != -1 ) {
  //   processPlay(d);
  // }
  // else {
  //   d.event = '';
  // }

  processPlay(d);
})

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
y = d3.scale.linear().domain([-20, 5]).range([h, 0]);
var xAxis = d3.svg.axis().scale(x).ticks(0).tickSize(0,0);
var yAxisLeft = d3.svg.axis().scale(y).ticks(0).tickSize(0,0).tickValues([0,25,50,75,100]).orient("left");

// x axis
svg.append("svg:g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + y(0) + ")")
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
.append('text')
  .text(function(d) {
    if(d.type == '1') {
      return "R";
    } else if(d.type == '2') {
      return "S";
    } else {
      return "B";
    }
  })
  .attr('x',function(d){
    return w* time_to_elapsed_secs(d.time)/2400;
  })
  .attr('y',function(d){
    return (h/2)-10;
  })
  .attr('r', function(d){
    return 4;
  })
  .attr('class', 'playerevents');
// .append('circle')
//   .attr('cx',function(d){
//     return w* time_to_elapsed_secs(d.time)/2400;
//   })
//   .attr('cy',function(d){
//     return (h/2)-15;
//   })
//   .attr('r', function(d){
//     return 4;
//   })
//   .attr('class', 'playerevents');


// halftime line
svg.append("line")
	.attr({
	  "x1": w/2,
	  "y1": 0,
	  "x2": w/2,
	  "y2": h,
	  'class': 'halftimeLine'
});

var bars = svg.selectAll('g')
            .data(fullgame)
            .enter()
            .append('g')

bars.append('rect')
      .attr({
        width:2,
        height: function(d) {
          if (d.event != '') {
          //   //if (d.text.search("Kravish") != -1)
          //   if (d.team == 'CAL') {
          //     return y(d.margin) - (h/2);
          //   }
          //   else if (d.team =='STANFORD') {
          //     return y(d.margin)-(h/2);
          //   }
          // }
            return lineHeight;
            }  
        },
        x: function(d) {
          return x(time_to_x(d.time));
        },
        y: function(d) {
          if (d.event != '') {
            if (d.team =='CAL')
              return 0;
            else if(d.team == 'STANFORD')
              return h - lineHeight;
          }
          // return h - y(d.margin);
        },
        class: function(d) {
          if (d.text.search("Kravish") != -1)
            return "kravish";
        },
        fill: function(d) {
          if (d.event != '') {
            if ($.inArray(d.event,['3pt','Stl','2pts','Reb','OReb','FT','Block','Steal'])!=-1) {
              return 'green';
            }
            else {
              return 'red';
            }
          }
        }
      })
      .on("mouseover", function(d) {
        console.log(d.time+" - "+d.text);
      });

//Margin of victory line
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

// x axis labels
svg.append("text")
  .attr("class", "axislabel timetext")
  .attr("text-anchor", "middle")
  .attr("x", 20)
  .attr("y", y(0) + 15)
  .text("20:00");
svg.append("text")
  .attr("class", "axislabel timetext")
  .attr("text-anchor", "middle")
  .attr("x", w/4 + 20)
  .attr("y", y(0) + 15)
  .text("10:00");
svg.append("text")
  .attr("class", "axislabel timetext")
  .attr("text-anchor", "middle")
  .attr("x", w/2+20)
  .attr("y", y(0) + 15)
  .text("20:00");
svg.append("text")
  .attr("class", "axislabel timetext")
  .attr("text-anchor", "middle")
  .attr("x", 3*w/4 + 20)
  .attr("y", y(0) + 15)
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

function processPlay(d) {

  var play= '';
  if (d.text.search('made Jumper')!= -1)
    play ="2pts";
  else if (d.text.search('missed Jumper') != -1)
    play = 'Miss';
  else if (d.text.search('Foul') != -1)
    play = 'Foul';
  else if (d.text.search('Block') != -1)
    play = 'Blk';
  else if (d.text.search('Defensive Rebound') != -1)
    play = 'Reb';
  else if (d.text.search('Offensive Rebound') != -1)
    play = 'OReb';
  else if (d.text.search('Turnover') != -1)
    play = 'TO';
  else if (d.text.search('made Free Throw') != -1)
    play = 'FT';
  else if (d.text.search('missed Free Throw') != -1)
    play = 'Missed FT';
  else if (d.text.search('made Layup') != -1)
    play = '2pts';
  else if (d.text.search('missed Layup') != -1)
    play = 'Miss';
  else if (d.text.search('made Three Point') != -1)
    play = '3pt';
  else if (d.text.search('missed Three Point') != -1)
    play = 'Miss 3pt';
  else if (d.text.search('Steal') != -1)
    play = 'Stl';
  else if (d.text.search('Dunk') != -1)
    play = '2pts';

  d.event = play;
  // console.log(d);
}






