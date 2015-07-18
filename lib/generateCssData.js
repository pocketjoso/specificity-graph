'use strict';

var cssParse = require('css-parse');
var unminify = require('cssbeautify');
var specificity = require('specificity');


var specSum = function(selector){
  var specs = specificity.calculate(selector)[0].specificity.split(',');
  var sum = (parseInt(specs[0])*1000) + (parseInt(specs[1])*100) + (parseInt(specs[2])*10) + (parseInt(specs[3]));
  return sum;
};

/*
 * Adds rule to results. Modifies pass in results array
 * PARAMS: rule (object), selectorIndex (int), results (array)
 * RETURNS: selectorIndex
 */
var addRuleToResults = function(rule, selectorIndex, results) {
  var selectors = rule.selectors || [];
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
  return selectorIndex;
};

var generateCssData = function(origCss) {

  var testCSS = unminify(origCss);
  var astObj = cssParse(testCSS, {silent: true});

  var results = [],
      selectorIndex = 0;

  astObj.stylesheet.rules.map(function(rule){
    if (rule.type === 'media') {
      rule.rules.forEach(function(rule){
        selectorIndex = addRuleToResults(rule, selectorIndex, results);
      });
    } else if (rule.type === 'rule') {
      selectorIndex = addRuleToResults(rule, selectorIndex, results);
    }

  });

  return results;

};

module.exports = generateCssData;
