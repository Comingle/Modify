import Ember from 'ember';
import SineWave from 'chrome-app/lib/sine-wave';

export default Ember.Component.extend({
  classNames: ['motors-graph'],
  backgroundColor: '#202336',
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

    this.svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr('fill', this.get('backgroundColor'));

    this.createMotorOne();
    this.createMotorTwo();
    this.createMotorThree();
  },

  createMotorOne: function () {
    let motorOne = this.get('motorOne')
    let path = this.createPath(motorOne);
    this.set('motorOnePath', path);
  },

  createMotorTwo: function () {
    let motorTwo = this.get('motorTwo')
    let path = this.createPath(motorTwo);
    this.set('motorTwoPath', path);
  },

  createMotorThree: function () {
    let motorThree = this.get('motorThree')
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
      .attr("stroke", color)
      .attr("stroke-width", strokeWidth)
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
