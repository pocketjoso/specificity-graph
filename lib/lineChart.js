'use strict';

var d3 = require('d3');

if (typeof window === "undefined") {
  console.log('d3 requires a browser to run. EXITING');
  return;
}

var _state = {
  data: {},
  vis: undefined,
  width: 1000,
  height: 400,
  padding: {
    top:    30,
    right:  60,
    bottom: 30,
    left:   60
  },

  min_val: 0, //same for x/y
  max_val_y: 100,

  d3_x : undefined,
  d3_y : undefined,

  data_attribute_name_x : 'selectorIndex',
  data_attribute_name_y : 'specificity'
};


var lineFunc = d3.svg.line()
  .x(function(d,idx) {
    return _state.d3_x(d[_state.data_attribute_name_x]);
  })
  .y(function(d) {
    return _state.d3_y(d[_state.data_attribute_name_y]);
  })
  .interpolate('linear');

var _create =  function(data, opts){
  _state.data = data;
  var opts = opts || {};

  _state.width = opts.width || _state.width,
  _state.height = opts.height || _state.height,
  _state.data_attribute_name_x = opts.xProp || _state.data_attribute_name_x;
  _state.data_attribute_name_y = opts.yProp || _state.data_attribute_name_y;

  var svgSelector = opts.svgSelector || '.js-graph';


  _state.vis = d3.select(svgSelector);

  _update(_state.data);

  //below elements don't change based on data

  var xAxis = d3.svg.axis()
        .scale(_state.d3_x)
        .tickSize(0),
      yAxis = d3.svg.axis()
        .scale(_state.d3_y)
        .tickSize(0)
        .orient('left');

  _state.vis.append('svg:g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + (_state.height - _state.padding.bottom) + ')')
    .call(xAxis);

  _state.vis.append('svg:g')
    .attr('class', 'axis')
    .attr('transform', 'translate(' + (_state.padding.left) + ',0)')
    .call(yAxis);

  // x domain label
  _state.vis.append('svg:text')
    .attr('class', 'domain-label')
    .attr('text-anchor', 'middle')
    .attr('x', (_state.width/2))
    .attr('y', _state.height)
    .attr('transform', 'translate(0,' + (-_state.padding.bottom+24) + ')')
    .text('Location in stylesheet');

  // y domain label
  _state.vis.append('svg:text')
    .attr('class', 'domain-label')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate('+(_state.padding.left-16) + ','+(_state.height/2)+')rotate(-90)')
    .text('Specificity');

  // handle on mouseover focus circle and info text
  var focus = _state.vis.append('svg:g')
  .attr('class', 'focus')
  .style('display', 'none');

  focus.append('svg:circle')
    .attr('r', 4.5);

  focus.append('svg:rect')
    .attr('class', 'focus-text-background js-focus-text-background')
    .attr('width',300)
    .attr('height',20)
    .attr('y', '-30')
    // .attr('x', '-150')
    .attr('ry', '14')
    .attr('rx', '4');

  focus.append('svg:text')
    .attr('class', 'focus-text js-focus-text')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('y', '-20');

  _state.vis.append('svg:rect')
    .attr('class', 'overlay')
    .attr('width', _state.width)
    .attr('height', _state.height)
    .on('mouseover', function() { focus.style('display', null); })
    .on('mouseout', function() { focus.style('display', 'none'); })
    .on('mousemove', mousemove);

  var bisectX = d3.bisector(function(d) {
    return d[_state.data_attribute_name_x];
  }).right;

  function mousemove() {
    var x0 = _state.d3_x.invert(d3.mouse(this)[0]),
        i = bisectX(_state.data, x0),
        d0 = _state.data[i - 1],
        d1 = _state.data[i],
        d;

    if(typeof d0 === 'undefined'){
      if(typeof d1 === 'undefined'){
        return;
      }
      d = d1;
    } else if(typeof d1 ==='undefined'){
      d = d0;
    } else {
      d = x0 - d0[_state.data_attribute_name_x] > d1[_state.data_attribute_name_x] - x0 ? d1 : d0;
    }

    focus.attr('transform', 'translate(' + _state.d3_x(d[_state.data_attribute_name_x]) + ',' + _state.d3_y(d[_state.data_attribute_name_y]) + ')');
    var t = focus.select('.js-focus-text');
    t.text(d.selectors);

    var w = t[0][0].getBBox().width + 20;

    focus.select('.js-focus-text-background')
      .attr('width', w)
      .attr('x', -w/2);

  }
}

var _update = function(data){
  _state.data = data;

  _state.max_val_y = Math.max(100, d3.max(_state.data, function(d) {
    return d[_state.data_attribute_name_y];
  }));

  _state.d3_x = d3.scale.linear()
    .range([_state.padding.left, _state.width - _state.padding.right])
    .domain([_state.min_val, d3.max(_state.data, function(d,idx) {
    return d[_state.data_attribute_name_x];
  })]);

  _state.d3_y = d3.scale.linear()
    .range([_state.height - _state.padding.top, _state.padding.bottom])
    .domain([_state.min_val, _state.max_val_y]);


  //TODO: transition path, instead of remove hack
  if(document.querySelectorAll('.line-path').length === 0) {
    _state.vis.append('svg:path')
      .attr('d', lineFunc(_state.data))
      .attr('class', 'line-path');
  } else {
    _state.vis.insert('svg:path', '.line-path')
      .attr('d', lineFunc(_state.data))
      .attr('class', 'line-path');

    document.querySelector('.line-path:last-of-type').remove();
  }
}

module.exports = {
  create: _create,
  update: _update
};
