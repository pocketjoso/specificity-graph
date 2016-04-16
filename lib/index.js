'use strict';
/*
 * Node module wrapper for specificity-graph
 */

var fs     = require('fs'),
    path   = require('path'),
    mkdirp = require('mkdirp'),
    generateCssData = require('./generateCssData'),
    Promise = require('es6-promise').Promise;

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
  directory = directory || './specificity-graph';
  cb = cb || function(){};
  var json = JSON.stringify(generateCssData(css.toString()));

  // chainable promises
  createDirectory({
    'json': json,
    'directory':directory
  }).then(writeSpecificityJson, errorHandler)
    .then(addExampleFiles, errorHandler)
    .then(cb, errorHandler);

  function errorHandler( err ) {
    throw err;
  }
};

/**
 * Create directory to hold files.
 * @param  {Object}  options            Options data
 * @param  {String}  options.directory  Directory
 * @param  {Object}  options.json       JSON data.
 * @return {void}
 */
function createDirectory(options) {
  return new Promise(function(resolve, reject) {
    mkdirp( options.directory, function (err) {
      if(err && err.code !== 'EEXIST') {
        reject(err);
      } else {
        resolve(options);
      }
    });
  });
}

/**
 * Write the specificity JSON to file
 * @param  {Object}  options            Options data
 * @param  {String}  options.directory  Directory
 * @param  {Object}  options.json       JSON data.
 * @return {void}
 */
function writeSpecificityJson(options) {
  return new Promise(function(resolve, reject) {
    var dest = path.join(options.directory, 'specificity.json');
    var out = fs.createWriteStream(dest);
    out.write(new Buffer(options.json));
    out.end();
    resolve(options);
  });
}

/**
 * This method copy the required js/css files and also
 * inject json into html.
 * @param  {Object}  options            Options data
 * @param  {String}  options.directory  Directory
 * @param  {Object}  options.json       JSON data.
 * @return {void}
 */

function addExampleFiles(options) {


  return new Promise(function(resolve, reject) {
    var templateFile = path.join(__dirname, '../template/cli.html');
    var tasks = [];

    tasks.push(writeHTMLFile(options));
    // add necessary JS files
    tasks.push(copyFileToDir('specificity-graph-standalone.js', options.directory))
    tasks.push(copyFileToDir('example.js', options.directory));

    // make sure all these aync tasks are done.
    Promise.all(tasks).then(resolve,reject);
  });
}

/**
 * This method creates index.html with injected data.
 *
 * @param  {Object}  options            Options data
 * @param  {String}  options.directory  Directory
 * @param  {Object}  options.json       JSON data.
 * @return {void}
 */

function writeHTMLFile(options) {
  return new Promise(function(resolve, reject) {
    var templateFile = path.join(__dirname, '../template/cli.html');
     // read our template file
     fs.readFile(templateFile, 'utf8', function (err,data) {
      if (err) {
        reject(err);
      }
      // insert the generated json data
      var result = data.replace('{{ insertJSONHere }}', 'var embeddedJsonData = '+ options.json + ';');

      // write file to directory
      fs.writeFile(path.join(options.directory, 'index.html'), result, 'utf8', function (err) {
         if (err) {
          reject(err);
         }
         resolve(options.directory);
      });
    });
  });
}


/**
 * This function copy file from root directory
 * to provided directory
 * @param  {[type]} file      [description]
 * @param  {[type]} directory [description]
 * @return {[type]}           [description]
 */
function copyFileToDir(file, directory) {
  return new Promise(function(resolve, reject) {
      if(file.split(path.sep).length > 1) {
      mkdirp.sync(path.dirname(path.join(directory, file)));
    }

    fs
      .createReadStream(path.join(__dirname, '../' + file))
      .pipe(fs.createWriteStream(path.join(directory, file)))
      .on('finish', resolve)
      .on('error', reject);
  });
}
