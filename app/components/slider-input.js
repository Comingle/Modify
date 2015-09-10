import Ember from 'ember';

// {{slider-input
//   data=controlOption
//   rightHandleValueChanged='maxValueChanged'
//   rightHandleValueChangEnded='maxValueChanged'
//   leftHandleValueChanged='minValueChanged'
//   rangeLineColor=pattern.colorHex
// }}

// controlOption must have a max and/or min

export default Ember.Component.extend({
  classNames: ['slider-input'],
  lineColor: '#cad1e5',
  handleColor: '#344276',
  handleStrokeColor: 'white',
  handleStrokeWidth: 4,
  handleOverflow: 10,

  didInsertElement: function () {
    let elementId = '#' + this.get('elementId');
    let width = $(elementId).width();
    let height = $(elementId).height();
    let svg = d3.select(elementId).append('svg')
      .attr('width', width)
      .attr('height', height);

    this.set('svg', svg);
    this.setDimensions(width, height);
    this.build();
    if (typeof(this.get('leftHandleValue')) != 'undefined') {
      this.$("circle.left").attr('data-original-title', this.get('leftHandleValue'));
    }
    this.$("circle.right").attr('data-original-title', this.get('rightHandleValue'));
    this.$("circle").tooltip({container: "#" + this.get('elementId')});
  },

  setDimensions: function (width, height) {
    let handleStrokeWidth = this.get('handleStrokeWidth');
    let lineWidth = height - (handleStrokeWidth * 2) - this.get('handleOverflow');
    let handleRadius = (height - (handleStrokeWidth)) / 2;
    let linePadding = handleRadius + handleStrokeWidth;
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
    let allY = this.get('allY');
    let handleColor = this.get('handleColor');
    let handleStrokeColor = this.get('handleStrokeColor');
    let handleStrokeWidth = this.get('handleStrokeWidth');
    let handleRadius = this.get('handleRadius');
    let cxRight = this.get('rightHandleValue');
    let cxLeft = this.get('leftHandleValue');
    let minValue = this.get('minValue');
    let maxValue = this.get('maxValue');
    let scale = d3.scale.linear()
      .domain([0, 100])
      .range([x1, x2]);
    let rangeLineX1 = function () {
      if (cxLeft) {
        return scale(cxLeft);
      } else {
        return x1;
      }
    };
    let rangeLineX2 = function () {
      if (cxRight) {
        return scale(cxRight);
      } else {
        return x1;
      }
    };

    svg.append("line")
      .style("stroke", lineColor)
      .style("stroke-width", lineWidth)
      .style("stroke-linecap", "round")
      .attr("x1", x1)
      .attr("y1", allY)
      .attr("x2", x2)
      .attr("y2", allY);

    let rangeLine = svg.append("line")
      .style("stroke", this.get('rangeLineColor'))
      .style("stroke-width", lineWidth)
      .style("stroke-linecap", "round")
      .attr("x1", rangeLineX1)
      .attr("y1", allY)
      .attr("x2", rangeLineX2)
      .attr("y2", allY);

    if (cxRight || cxRight === 0) {
      let rightHandle = svg.append('circle')
        .style('fill', handleColor)
        .style('stroke', handleStrokeColor)
        .style('stroke-width', handleStrokeWidth)
        .attr('class', 'handle right')
        .attr('cy', allY)
        .attr('cx', function () { return scale(cxRight); })
        .attr('r', handleRadius)
        .call(this.get('dragRight'));

      this.set('rightHandle', rightHandle);
    }

    if (cxLeft || cxLeft === 0) {
      let leftHandle = svg.append('circle')
        .style('fill', handleColor)
        .style('stroke', handleStrokeColor)
        .style('stroke-width', handleStrokeWidth)
        .attr('class', 'handle left')
        .attr('cy', allY)
        .attr('cx', function () { return scale(cxLeft); })
        .attr('r', handleRadius)
        .call(this.get('dragLeft'));

      this.set('leftHandle', leftHandle);
    }

    this.set('lowX', x1);
    this.set('highX', x2);
    this.set('rangeLine', rangeLine);
  },

  rebuild: function () {
    Ember.$( window ).resize(function() {
      let elementId = '#' + this.get('elementId');
      let width = $(elementId).width();
      let height = $(elementId).height();
      let svg = d3.select(elementId).append('svg')
        .attr('width', width)
        .attr('height', height);

      this.set('svg', svg);
      this.setDimensions(width, height);
      this.build();
    });
  }.observes('height', 'width'),

  updateLeftHandle: function (newX) {
    let handle = this.get('leftHandle');
    let line = this.get('rangeLine');
    d3.transition(handle).attr('cx', newX);
    d3.transition(line).attr('x1', newX);
  },

  updateRightHandle: function (newX) {
    let handle = this.get('rightHandle');
    let line = this.get('rangeLine');
    d3.transition(handle).attr('cx', newX);
    d3.transition(line).attr('x2', newX);
  },

  valueToPercentScale: function () {
    let lowX = this.get('lowX');
    let highX = this.get('highX');
    return d3.scale.linear()
      .domain([lowX, highX])
      .range([0, 100]);
  }.property(),

  dragLeft: function () {
    let component = this;
    let currentValue;
    return d3.behavior.drag()
      .on("drag", function() {
        let newX = d3.event.x;
        let newValue = component.get('valueToPercentScale')(newX);
        if (0 <= newValue && newValue <= 100) {
          currentValue = newValue;
          component.updateLeftHandle(newX);
          component.set('leftHandleValue', newValue);
        }
        component.$("circle.left").tooltip('hide');
      }).on('dragend', function() {
        component.$("circle.left").attr("data-original-title", parseInt(currentValue));
        component.$("circle.left").tooltip('show');
      });
  }.property(),

  dragRight: function () {
    let component = this;
    let currentValue;
    return d3.behavior.drag()
      .on("drag", function() {
        let newX = d3.event.x;
        let newValue = component.get('valueToPercentScale')(newX);
        if (0 <= newValue && newValue <= 100) {
          currentValue = newValue;
          component.updateRightHandle(newX);
          component.sendAction('rightHandleValueChanged', component.get('data'), newValue);
          component.set('rightHandleValue', newValue);
        }
        component.$("circle.right").tooltip('hide');
      }).on('dragend', function () {
        component.$("circle.right").attr("data-original-title", parseInt(currentValue));
        component.$("circle.right").tooltip('show');
        component.sendAction('rightHandleValueChangeEnded', component.get('data'), currentValue);
      });
  }.property(),

  percentToReal: function (percent) {
    let min = this.get('data.min');
    let max = this.get('data.max');
    return d3.scale.linear()
      .domain([0, 100])
      .range([min, max]);
  }
});
