var specificityGraph = require('../lib/index'),
generateCssData = require('../lib/generateCssData'),
chai = require('chai'),
expect = chai.expect,
fs = require('fs'),
path = require('path'),
rimraf = require('rimraf');

process.chdir('test');

var cssSelectorArray = [
  'body { color: red;}',
  '.div { color: red; }',
  '.div.div { color: red; }',
  'input[type=text] { color: red; }',
  '#kill-me { color: red; }',
  '@media screen and (min-width: 600px) { .media-query-selector { color: red; }',
  '.another-one-inside-mq { color: red; } }'
];
var css = cssSelectorArray.join(' ');

after(function(done){
  console.log('clean up generated files..');
  try {
    rimraf(path.join(__dirname, 'fileTestDir'), function(er){});
    rimraf(path.join(__dirname, 'specificity-graph'), function(er){});
    rimraf(path.join(__dirname, 'directoryName'), function(er){
      done();
    });
  } catch(err) {
    done();
  }
});

describe('node module tests', function() {

    it('should generate specificity files', function() {
      var directory = path.join(__dirname, 'fileTestDir');
      specificityGraph(directory, css, function(dest, err){
        expect(
          fs.existsSync(path.join(__dirname, directory, 'specificity.json')) &&
          fs.existsSync(path.join(__dirname, directory, 'specificity-graph-standalone.js')) &&
          fs.existsSync(path.join(__dirname, directory, 'index.html')) &&
          fs.existsSync(path.join(__dirname, directory, 'example.js'))
        );
      });
    });

    it('should generate specificity files in default directory if not specified', function() {
      specificityGraph('', css, function(dest, err){
        expect(dest).to.eql('./specificity-graph');
      });
    });

    it('should generate specificity files in chosen directory', function() {
      var directory = path.join(__dirname, 'directoryName');
      specificityGraph(directory, css, function(dest, err){
        expect(dest).to.eql(directory);
      });
    });

    it('should generate one graph node per selector in css', function() {
      expect(generateCssData(css).length).to.eql(cssSelectorArray.length);
    });
});
