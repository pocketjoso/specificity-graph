var fs     = require('fs'),
    path   = require('path');
    mkdirp = require('mkdirp');
    colors = require('cli-color');

/**
 * Create a directory if the directory does not already exist
 * @param  {String}   directory Directoru
 * @param  {OBject}   data      Data to write
 * @param  {Function} cb        Success callback
 * @return {void}
 */
function mkdir(directory, data, cb) {
  fs.mkdir(directory, function (err) {
    if(err) {
      console.log(colors.yellow('[specificity-graph] The directory already exist'));
    }
    appendData(directory, data, cb);
  });
}

/**
 * Write the specificity JSON
 * @param  {String}   directory dest
 * @param  {Object}   data
 * @param  {Function} cb
 * @return {void}
 */
function appendData(directory, data, cb) {

  cb = cb || function(){};
  var dest = path.join(directory, 'specificity.json');
  var out = fs.createWriteStream(dest);
  var json = JSON.stringify(data);
  out.write(new Buffer(json));
  out.end();

  addExampleFiles(json, directory);
  cb(dest);
}

function addExampleFiles(json, directory) {
  var templateRoot     = __dirname.replace('lib','template/');
  // read our template file
  fs.readFile(templateRoot + 'cli.html', 'utf8', function (err,data) {
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
  var root     = __dirname.replace('lib','');
  if(file.split(path.sep).length > 1) {
    mkdirp.sync(path.dirname(path.join(directory, file)));
  }
  fs
    .createReadStream(root + file)
    .pipe(fs.createWriteStream(path.join(directory, file)));
}


module.exports = mkdir;
