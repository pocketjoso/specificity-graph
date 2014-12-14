'use strict'

var specificityGraph = require('./lib/core');

//we're using d3 and drawing an SVG inside the DOM, this requires a browser.
if(typeof document === 'undefined') return;

function defaultExemple() {
  var css = "body { font-size: 100%; }"+
            ".group { margin-bottom: 2em; }"+
            "#nav { display: block; }";

  // initialize the specificity graph
  specificityGraph.create(css, {
    svgSelector: '.js-graph'
  });
}

var httpRequest = new XMLHttpRequest()
httpRequest.onreadystatechange = function (data) {

  if(httpRequest.readyState == 4 && httpRequest.status == 200) {
    var json = JSON.parse(httpRequest.responseText);
    specificityGraph.draw(json,{
      svgSelector: '.js-graph'
    });
  }else {
    defaultExemple();
  }
}
httpRequest.open('GET', 'specificity.json');
httpRequest.send();


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
