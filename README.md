# Specificity Graph (for CSS)
[![NPM version](https://badge.fury.io/js/specificity-graph.svg)](http://badge.fury.io/js/specificity-graph)

Idea by [Harry Roberts](http://csswizardry.com/2014/10/the-specificity-graph/)

![The generated graph](https://raw.githubusercontent.com/pocketjoso/specificity-graph/master/img/example-graph.png)
Generate an interactive line graph showing the specificity in your stylesheet. Uses [d3](https://github.com/mbostock/d3), [css-parser](https://github.com/reworkcss/css-parse), and [specificity](https://github.com/keeganstreet/specificity).

[Online Specificity Graph generator](http://jonassebastianohlsson.com/specificity-graph/)

## Installation
`npm install specificity-graph`

To get the example `index.html` up and running:  
1. Clone repo  
2. `npm install`  
3. `npm run example`

# Standalone Browser compatible Build (`specificity-graph-standalone.js`)

You can find a browser compatible version of this library as `specificity-graph-standalone.js`.

## Usage
First require `./lib/core`.

`specificityGraph.create(css, options)`

`specificityGraph.update(css)`


## Changelog
0.0.2 Prev/Next focus functions  
0.0.1 Npm package  
0.0.0 Initial version  
