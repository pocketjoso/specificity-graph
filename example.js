'use strict'

// if using standalone js, specifityGraph will be a global.
// If going to be bundled via f.e. Browserify, just require
var specificityGraph = specificityGraph || require('./lib/core');

function defaultExample() {
  var css = "body { font-size: 100%; }"+
            ".group { margin-bottom: 2em; }"+
            "#nav { display: block; }";

  // initialize the specificity graph
  specificityGraph.create(css, {
    svgSelector: '.js-graph'
  });
}

// we inject a global embeddedJsonData var when running cli command,
// if that's the case, display that data, otherwise default
if(typeof embeddedJsonData === 'undefined'){
  defaultExample();
} else {
  specificityGraph.draw(embeddedJsonData,{
    svgSelector: '.js-graph'
  });
}


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
