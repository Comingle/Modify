import Ember from 'ember';
import SineWave from 'chrome-app/lib/sine-wave';

// {{motors-graph
//   motorOne=motorOne
//   motorTwo=motorTwo
//   motorThree=motorThree
// }}

export default Ember.Component.extend({
  classNames: ['motors-graph'],
  backgroundColor: '#232538',
  strokeWidth: 6,
  second: 1000,
  maxY: 255,

  didInsertElement: function () {
    let elementId = '#' + this.get('elementId');
    let width = $(elementId).width();
    let height = $(elementId).height();
    this.set('width', width);
    this.set('height', height);
    this.svg = d3.select(elementId).append('svg')
      .attr("xmlns", 'http://www.w3.org/2000/svg')
      .attr("version", "1.2")
      .attr("viewBox", "0 0 " + width + " " + height)
      .attr('height', 360);
      .attr('height', height);

    this.svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("z-index", "-1")
      .attr('fill', this.get('backgroundColor'));

    for (let i = 0; i<width; i+=24) {
      this.svg.append("line")
      .attr("x1", i)
      .attr("x2", i)
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "#292e41")
      .attr("stroke-width", "2px");
    }

    for (let i = 0; i<height; i+=24) {
      this.svg.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", i)
      .attr("y2", i)
      .attr("stroke", "#292e41")
      .attr("stroke-width", "2px");
    }

    // clipPath to keep motor curves out of the top/bottom cut-off rects
    this.svg.append("defs")
    .append("clipPath")
    .attr("id", "clipPath")
    .append("rect")
    .attr("width", "100%")
    .attr("x", 0)
    .attr("y", 24)
    .attr("height", height-48);

    // motor curves
    this.createMotorOne();
    this.createMotorTwo();
    this.createMotorThree();

    // top and bottom cut-off rects
    this.svg.append("rect")
      .attr("width", "100%")
      .attr("height", 24)
      .attr("z-index", "2")
      .attr("opacity", "0.5")
      .attr('fill', "#262941");

    this.svg.append("rect")
      .attr("width", "100%")
      .attr("height", 24)
      .attr("z-index", "2")
      .attr("opacity", "0.5")
      .attr("x", 0)
      .attr("y", height-24)
      .attr('fill', "#262941");

    // rect borders -- these need to be drawn separately because of low
    // opacity on the cut-off rects
    this.svg.append("line")
      .attr("x1", "0")
      .attr("x2", width)
      .attr("y1", 24)
      .attr("y2", 24)
      .attr("stroke", "#474f76")
      .attr("stroke-width", "1px")
      .attr("z-index", "3")
      .attr("stroke-dasharray", "2px");

    this.svg.append("line")
      .attr("x1", "0")
      .attr("x2", width)
      .attr("y1", height-24)
      .attr("y2", height-24)
      .attr("stroke", "#474f76")
      .attr("stroke-width", "1px")
      .attr("z-index", "3")
      .attr("stroke-dasharray", "2px");

    this.svg.append("text")
      .attr("x", width-153)
      .attr("y", 17)
      .attr("fill", "#484f76")
      .attr("font-family", "Futura")
      .attr("font-size", "11px")
      .text("MAXIMUM INTENSITY");

    this.svg.append("text")
      .attr("x", width-150)
      .attr("y", height-7)
      .attr("fill", "#484f76")
      .attr("font-family", "Futura")
      .attr("font-size", "11px")
      .text("MINIMUM INTENSITY");


  },

  createMotorOne: function () {
    let motorOne = this.get('motorOne');
    let path = this.createPath(motorOne);
    this.set('motorOnePath', path);
  },

  createMotorTwo: function () {
    let motorTwo = this.get('motorTwo');
    let path = this.createPath(motorTwo);
    this.set('motorTwoPath', path);
  },

  createMotorThree: function () {
    let motorThree = this.get('motorThree');
    let path = this.createPath(motorThree);
    this.set('motorThreePath', path);
  },

  createPath: function (motor) {
    let sin = new SineWave(
      motor.get('percentAmplitudeMin'),
      motor.get('percentAmplitudeMax'),
      motor.get('cyclesPerSecond'),
      motor.get('percentPhaseShift'),
      this.get('second'),
      this.get('maxY')
    );
    let lineData = this.getLineData(sin);
    let path = this.draw(lineData, motor.get('color'));
    return path;
  },

  updateMotorOne: function () {
    let motor = this.get('motorOne');
    let path = this.get('motorOnePath');
    this.updatePath(motor, path);
  }.observes('motorOne.percentAmplitudeMin',
             'motorOne.percentAmplitudeMax',
             'motorOne.cyclesPerSecond',
             'motorOne.percentPhaseShift'),

  updateMotorTwo: function () {
    let motor = this.get('motorTwo');
    let path = this.get('motorTwoPath');
    this.updatePath(motor, path);
  }.observes('motorTwo.percentAmplitudeMin',
             'motorTwo.percentAmplitudeMax',
             'motorTwo.cyclesPerSecond',
             'motorTwo.percentPhaseShift'),

  updateMotorThree: function () {
    let motor = this.get('motorThree');
    let path = this.get('motorThreePath');
    this.updatePath(motor, path);
  }.observes('motorThree.percentAmplitudeMin',
             'motorThree.percentAmplitudeMax',
             'motorThree.cyclesPerSecond',
             'motorThree.percentPhaseShift'),

  updatePath: function (motor, path) {
    let sin = new SineWave(
      motor.get('percentAmplitudeMin'),
      motor.get('percentAmplitudeMax'),
      motor.get('cyclesPerSecond'),
      motor.get('percentPhaseShift'),
      this.get('second'),
      this.get('maxY')
    );
    let lineData = this.getLineData(sin);
    let lineFunction = this.get('lineFunction');

    d3.transition(path).attr("d", lineFunction(lineData));
  },

  draw: function (lineData, color) {
    let lineFunction = this.get('lineFunction');
    let strokeWidth = this.get('strokeWidth');
    let path = this.svg.append("path")
      .attr("d", lineFunction(lineData))
      .attr("z-index", "1")
      .attr("stroke", color)
      .attr("stroke-width", strokeWidth)
      .attr("clip-path", "url(#clipPath)")
      .attr("fill", "none");
    return path;
  },

  getLineData: function (sin) {
   var lineData, point, i;
    lineData = [];
    i = 1;
    while (i < sin.second) {
      point = {};
      point.x = i;
      point.y = sin.at(i);
      lineData.push(point);
      i ++;
    }
    return lineData;
  },

  yScale: function () {
    let maxY = this.get('maxY');
    let height = this.get('height');
    let strokeWidth = this.get('strokeWidth');
    return d3.scale.linear()
      .domain([0, maxY])
      .range([height - (strokeWidth * 2), strokeWidth]);
  }.property(),

  xScale: function () {
    let maxX = this.get('second');
    let width = this.get('width');
    return d3.scale.linear()
      .domain([0, maxX])
      .range([0, width]);
  }.property(),

  lineFunction: function () {
    let xScale = this.get('xScale');
    let yScale = this.get('yScale');
    return d3.svg.line()
      .x(function (d) { return xScale(d.x); })
      .y(function (d) { return yScale(d.y); })
      .interpolate("basis");
  }.property()

});
