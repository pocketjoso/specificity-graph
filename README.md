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

## CLI

It creates a directory with a graph for a CSS:

Défault directory is **specificity-graph**.


```shell
.
└── specificity-graph
    ├── index.html // Graph
    ├── specificity.json // Stats for your css
    └── dist
        └── bundle.js // JS for the graph
```

- `specificity-graph style.css`
- `specificity-graph style.css -o my-output-directory`
- `cat style.css | specificity-graph > specificity.json`

### Standalone
If you’re not using npm, you can simply download `specificity-graph-standalone.js`.


## Usage
`var specificityGraph = require('specificity-graph')`,
or if using standalone:
`<script src='specificity-graph-standalone.js'></script>`


### Methods
`specificityGraph.create(css, options)`
`specificityGraph.update(css)`
`specificityGraph.draw(cssData, options)`

#### Options
`svgSelector` - Selector for `svg` element to draw specificity graph inside.
Defaults to `.js-graph`.  
`width` - default `1000`. You should set a viewBox value on the SVG element
to match `width` and `height`, f.e. `viewbox='0 0 1000 4000'`.  
`height` - default `400`.  
`showTicks` - (`true` | `false`). Show scale and ticks. Default `false`.  
`xProp` - (`'selectorIndex'` | `'line'`). What to base the x dimension,
 'location in stylesheet' in graph on: index of selector in CSS, or line number
 for selector in CSS. Default `'selectorIndex'`.  
`yProp` - default `'specificity'`.


## Changelog
0.0.3 showTicks option (thanks @MadLittleMods), options documentation.  
0.0.2 Prev/Next focus functions  
0.0.1 Npm package  
0.0.0 Initial version  
