'use strict';

var cssParse = require('css-parse');
var unminify = require('cssbeautify');
var specificity = require('specificity');

var generateCssData = function(origCss) {

  var testCSS = unminify(origCss);
  var astObj = cssParse(testCSS, {silent: true});

  var results = [],
      selectorIndex = 0;

  var specSum = function(selector){
    var specs = specificity.calculate(selector)[0].specificity.split(',');
    var sum = (parseInt(specs[0])*1000) + (parseInt(specs[1])*100) + (parseInt(specs[2])*10) + (parseInt(specs[3]));
    return sum;
  }

  astObj.stylesheet.rules.map(function(rule){
    var selectors = rule.selectors;
    if(typeof selectors === "undefined") {
      return;
    }
    var line = rule.position.start.line;

    selectors.forEach(function(selector){
      if(selector.length === 0) return;
      results.push({
        selectorIndex: selectorIndex,
        line: line,
        specificity: specSum(selector),
        selectors: selector
      });
      selectorIndex++;
    });

  });

  return results;

}

module.exports = generateCssData;
