import Ember from 'ember';
import SineWave from 'chrome-app/lib/sine-wave';

export default Ember.Component.extend({
  classNames: ['motors-graph'],
  strokeWidth: 6,
  second: 1000,
  maxY: 255,

  didInsertElement: function () {
    let elementId = '#' + this.get('elementId')
    let width = $(elementId).width();
    let height = $(elementId).height();
    this.set('width', width);
    this.set('height', height);
    this.svg = d3.select(elementId).append('svg')
      .attr('width', width)
      .attr('height', height);
    this.updateMotorOne();
    this.updateMotorTwo();
    this.updateMotorThree();
  },

  updateMotorOne: function () {
    let motorOne = this.get('motorOne')
    let path = this.updatePath(motorOne);
    this.set('motorOnePath', path);
  }.observes('motorOne'),

  updateMotorTwo: function () {
    let motorTwo = this.get('motorTwo')
    let path = this.updatePath(motorTwo);
    this.set('motorTwoPath', path);
  }.observes('motorTwo'),

  updateMotorThree: function () {
    let motorThree = this.get('motorThree')
    let path = this.updatePath(motorThree);
    this.set('motorThreePath', path);
  }.observes('motorThree'),

  updatePath: function (motor) {
    let sin = new SineWave(
      motor.get('percentAmplitude'),
      motor.get('cyclesPerSecond'),
      motor.get('percentPhaseShift'),
      motor.get('second'),
      motor.get('maxY')
    );
    let lineData = this.getLineData(sin);
    let path = this.draw(lineData, motor.get('color'));
    return path;
  },

  draw: function (lineData, color) {
    let lineFunction = this.get('lineFunction');
    let strokeWidth = this.get('strokeWidth');
    let path = this.svg.append("path")
      .attr("d", lineFunction(lineData))
      .attr("stroke", color)
      .attr("stroke-width", strokeWidth)
      .attr("fill", "none");
    return 'path';
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
    };
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
      .x(function (d, i) { return xScale(d.x); })
      .y(function (d, i) { return yScale(d.y); })
      .interpolate("basis");
  }.property()

});
