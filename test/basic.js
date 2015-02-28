var specificityGraph = require('../lib/index.js'),
chai = require('chai'),
expect = chai.expect,
fs = require('fs'),
path = require('path'),
rimraf = require('rimraf');

process.chdir('test');

var css = 'body { color: red;} .div { color: red; } .div.div { color: red; } input[type=text] { color: red; }' +
  '#kill-me { color: red; }';

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
});
