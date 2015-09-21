import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['motors-graph'],
  backgroundColor: '#232538',
  strokeWidth: 6,
  second: 1000,
  maxY: 255,
  cellSideLength: 24,
  motorOneColor: '#d28dbf',
  motorTwoColor: '#fec742',
  motorThreeColor: '#dbe546',

  didInsertElement: function () {
    let elementId = '#' + this.get('elementId');
    let width = $(elementId).width();
    let height = $(elementId).height();
    let cellSideLength = this.get('cellSideLength');
    this.set('width', width);
    this.set('height', height);
    this.svg = d3.select(elementId).append('svg')
      .attr("xmlns", 'http://www.w3.org/2000/svg')
      .attr("version", "1.2")
      .attr("viewBox", "0 0 " + width + " " + height)
      .attr('height', 360)
      .attr('height', height);

    this.svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("z-index", "-1")
      .attr('fill', this.get('backgroundColor'));

    for (let i = 0; i<width; i+=cellSideLength) {
      this.svg.append("line")
      .attr("x1", i)
      .attr("x2", i)
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "#292e41")
      .attr("stroke-width", "2px");
    }

    for (let i = 0; i<height; i+=cellSideLength) {
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
    .attr("y", cellSideLength)
    .attr("height", height - (2 * cellSideLength));

    // top and bottom cut-off rects
    this.svg.append("rect")
      .attr("width", "100%")
      .attr("height", cellSideLength)
      .attr("z-index", "2")
      .attr("opacity", "0.5")
      .attr('fill', "#262941");

    this.svg.append("rect")
      .attr("width", "100%")
      .attr("height", cellSideLength)
      .attr("z-index", "2")
      .attr("opacity", "0.5")
      .attr("x", 0)
      .attr("y", height - cellSideLength)
      .attr('fill', "#262941");

    // rect borders -- these need to be drawn separately because of low
    // opacity on the cut-off rects
    this.svg.append("line")
      .attr("x1", "0")
      .attr("x2", width)
      .attr("y1", cellSideLength)
      .attr("y2", cellSideLength)
      .attr("stroke", "#474f76")
      .attr("stroke-width", "1px")
      .attr("z-index", "3")
      .attr("stroke-dasharray", "2px");

    this.svg.append("line")
      .attr("x1", "0")
      .attr("x2", width)
      .attr("y1", height - cellSideLength)
      .attr("y2", height - cellSideLength)
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

    this.generatePaths();
  },

  generatePaths: function () {
    let motorOneData   = [];
    let motorTwoData   = [];
    let motorThreeData = [];
    let frames = this.get('frames');
    if (frames) {
      let nextX = 0;
      frames.forEach( function (frame) {
        nextX = nextX + frame.get('timeMS');
        motorOneData.pushObject(  { x: nextX, y: frame.get('motorOne') });
        motorTwoData.pushObject(  { x: nextX, y: frame.get('motorTwo') });
        motorThreeData.pushObject({ x: nextX, y: frame.get('motorThree') });
      });

      let motorOnePath = this.drawPath(motorOneData, this.get('motorOneColor'));
      this.set('motorOnePath', motorOnePath);

      let motorTwoPath = this.drawPath(motorTwoData, this.get('motorTwoColor'));
      this.set('motorTwoPath', motorTwoPath);

      let motorThreePath = this.drawPath(motorThreeData, this.get('motorThreeColor'));
      this.set('motorThreePath', motorThreePath);
    }
  }.observes('frames'),

  updateMotorOnePath: function () {
    let motorData = this.motorDataFor('motorOne');
    let path = this.get('motorOnePath');
    this.updatePath(path, motorData);
  }.observes('frames.@each.motorOne'),

  updateMotorTwoPath: function () {
    let motorData = this.motorDataFor('motorTwo');
    let path = this.get('motorTwoPath');
    this.updatePath(path, motorData);
  }.observes('frames.@each.motorTwo'),

  updateMotorThreePath: function () {
    let motorData = this.motorDataFor('motorThree');
    let path = this.get('motorThreePath');
    this.updatePath(path, motorData);
  }.observes('frames.@each.motorThree'),

  updatePath: function (path, motorData) {
    let lineFunction = this.get('lineFunction');
    d3.transition(path).attr("d", lineFunction(motorData));
  },

  motorDataFor: function (motorName) {
    return this.get('frames').map(function (frame) {
      return { x: frame.get('timeMS'), y: frame.get(motorName) };
    });
  },

  drawPath: function (lineData, color) {
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

  yScale: function () {
    let height = this.get('height');
    let strokeWidth = this.get('strokeWidth');
    let lebelWidth = this.get('cellSideLength');
    return d3.scale.linear()
      .domain([0, this.get('maxY')])
      .range([height - strokeWidth * 2 - lebelWidth, strokeWidth + lebelWidth]);
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
