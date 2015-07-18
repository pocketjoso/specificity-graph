'use strict';

var generateCssData = require('./generateCssData');
var lineChart = require('./lineChart');

var _create = function(css, opts){
  var data = generateCssData(css);
  lineChart.create(data,opts);
};

var _update = function(css, opts){
  var data = generateCssData(css);
  lineChart.update(data);
};

module.exports = {
  create: _create,
  update: _update,
  createFromData: lineChart.create,
  nextFocus: lineChart.nextFocus,
  prevFocus: lineChart.prevFocus
};
