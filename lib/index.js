/*
 * Node module wrapper for specificity-graph
 */

var fs     = require('fs'),
    path   = require('path'),
    mkdirp = require('mkdirp'),
    colors = require('cli-color'),
    generateCssData = require('./generateCssData');

/**
 * Generates CSS specificity data in JSON format,
 * as well as a html chart.
 * Creates a directory if the directory specified does not already exist
 * @param  {String}   directory Directoru
 * @param  {OBject}   data      Data to write
 * @param  {Function} cb        Success callback
 * @return {void}
 */
module.exports = function(directory, css, cb) {
  var directory = directory || './specificity-graph';
  fs.mkdir(directory, function (err) {
    cb = cb || function(){};

    var json = JSON.stringify(generateCssData(css.toString()));

    writeSpecificityJson(json, directory);
    addExampleFiles(json, directory);
    cb(directory, err);
  });
}

/**
 * Write the specificity JSON to file
 * @param  {String}   directory dest
 * @param  {Object}   data
 * @param  {Function} cb
 * @return {void}
 */
function writeSpecificityJson(json, directory) {
  var dest = path.join(directory, 'specificity.json')
  var out = fs.createWriteStream(dest);
  out.write(new Buffer(json));
  out.end();
}

function addExampleFiles(json, directory) {
  var templateFile = path.join(__dirname, '../template/cli.html');

  // read our template file
  fs.readFile(templateFile, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    // insert the generated json data
    var result = data.replace('{{ insertJSONHere }}', 'var embeddedJsonData = '+ json + ';');

    // write file to directory
    fs.writeFile(path.join(directory, 'index.html'), result, 'utf8', function (err) {
       if (err) return console.log(err);
    });

    // add necessary JS files
    copyFileToDir('specificity-graph-standalone.js', directory);
    copyFileToDir('example.js', directory);
  });
}

function copyFileToDir(file, directory) {
  if(file.split(path.sep).length > 1) {
    mkdirp.sync(path.dirname(path.join(directory, file)));
  }
  fs
    .createReadStream(path.join(__dirname, '../' + file))
    .pipe(fs.createWriteStream(path.join(directory, file)));
}
