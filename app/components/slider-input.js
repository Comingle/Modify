import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['slider-input'],
  lineColor: 'LightSteelBlue',
  handleColor: 'SteelBlue',
  handleStrokeColor: 'white',
  handleStrokeWidth: 4,
  handleOverflow: 10,

  didInsertElement: function () {
    let elementId = '#' + this.get('elementId')
    let width = $(elementId).width();
    let height = $(elementId).height();
    let svg = d3.select(elementId).append('svg')
      .attr('width', width)
      .attr('height', height);

    this.set('svg', svg);
    this.setDimensions(width, height);
    this.build();
  },

  setDimensions: function (width, height) {
    let handleStrokeWidth = this.get('handleStrokeWidth');
    let lineWidth = height - (handleStrokeWidth * 2) - this.get('handleOverflow');
    let handleRadius = (height - (handleStrokeWidth)) / 2;
    let linePadding = handleRadius + handleStrokeWidth
    let allY = height / 2;
    let lineStartX = linePadding;
    let lineEndX = width - linePadding;

    this.set('width', width);
    this.set('height', height);
    this.set('lineStartX', lineStartX);
    this.set('allY', allY);
    this.set('lineEndX', lineEndX);
    this.set('handleRadius', handleRadius);
    this.set('lineWidth', lineWidth);
  },

  build: function () {
    let svg = this.get('svg');
    let lineColor = this.get('lineColor');
    let lineWidth = this.get('lineWidth');
    let x1 = this.get('lineStartX');
    let x2 = this.get('lineEndX');
    let lineLength = x2 - x1;
    let allY = this.get('allY');

    svg.append("line")
      .style("stroke", lineColor)
      .style("stroke-width", lineWidth)
      .style("stroke-linecap", "round")
      .attr("x1", x1)
      .attr("y1", allY)
      .attr("x2", x2)
      .attr("y2", allY);

    let handleColor = this.get('handleColor');
    let handleStrokeColor = this.get('handleStrokeColor');
    let handleStrokeWidth = this.get('handleStrokeWidth');
    let handleRadius = this.get('handleRadius')
    let cx = this.get('rightHandleValue');
    let drag = this.get('drag');
    let scale = d3.scale.linear()
      .domain([0, 100])
      .range([0, lineLength]);

    let rightHandle = svg.append('circle')
      .style('fill', handleColor)
      .style('stroke', handleStrokeColor)
      .style('stroke-width', handleStrokeWidth)
      .attr('class', 'handle')
      .attr('cy', allY)
      .attr('cx', function () { return scale(cx) })
      .attr('r', handleRadius)
      .call(drag);;

    this.set('rightHandle', rightHandle);
    this.set('lowX', x1);
    this.set('highX', x2);
  },

  valueToPercentScale: function () {
    let lowX = this.get('lowX');
    let highX = this.get('highX');
    return d3.scale.linear()
      .domain([lowX, highX])
      .range([0, 100]);
  }.property(),

  drag: function () {
    let component = this;
    return d3.behavior.drag()
      .on("drag", function(d) {
        let newX = d3.event.x
        let newValue = component.get('valueToPercentScale')(newX);
        if (0 <= newValue && newValue <= 100) {
          d3.select(this).attr('cx', newX);
          component.set('rightHandleValue', newValue);
        }
      });
  }.property()

});
