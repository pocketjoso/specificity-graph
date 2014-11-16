'use strict'

var specificityGraph = require('./lib/core');

//we're using d3 and drawing an SVG inside the DOM, this requires a browser.
if(typeof document === 'undefined') return;

var css = "body { font-size: 100%; }"+
          ".group { margin-bottom: 2em; }"+
          "#nav { display: block; }";

// initialize the specificity graph
specificityGraph.create(css, {
  svgSelector: '.js-graph'
});



// bind some events for stepping the graph focus
document.addEventListener('keydown', function(evt){
  if (evt.target.tagName == 'TEXTAREA'){
    return;
  }

  if(evt.keyCode === 39 || evt.keyCode === 32){
    specificityGraph.nextFocus();
  } else if(evt.keyCode === 37){
    specificityGraph.prevFocus();
  }
});

var prev = document.querySelector('.js-prev'),
    next = document.querySelector('.js-next');

prev.addEventListener('click', function(evt){
  specificityGraph.prevFocus();
});
next.addEventListener('click', function(evt){
  specificityGraph.nextFocus();
});
