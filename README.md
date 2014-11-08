# Specificity Graph (for CSS)
Idea by [Harry Roberts](http://csswizardry.com/2014/10/the-specificity-graph/)

![The generated graph](https://raw.githubusercontent.com/pocketjoso/specificity-graph/master/img/example-graph.png)
Generate a graph depicting the specificity in your stylesheet. Uses d3, css-parser, and specificity.

Online generator (coming soon)

## Installation
(will add as `npm package` soon)

To get the example `index.html` up and running:  
1. Clone repo  
2. `npm install`  
3. Use something like Browserify to generate a js bundle, for example
  `browserify example.js -o dist/bundle.js`  

Then just view `index.html` in your browser (doesn't require any server).

## Usage
First require `./lib/core`.

`specificityGraph.create(css, options)`

`specificityGraph.update(css)`


## Changelog
0.0.0 Initial version  
