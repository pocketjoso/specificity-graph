'use strict'

var specificityGraph = require('./lib/core');

//we're using d3 and drawing an SVG inside the DOM, this requires a browser.
if(typeof document === 'undefined') return;

var css = "body { font-size: 100%; }"+
          ".group { margin-bottom: 2em; }"+
          "#nav { display: block; }";

specificityGraph.create(css, {
  svgSelector: '.js-graph'
});
