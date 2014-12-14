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
  out.write(new Buffer(JSON.stringify(data)));
  out.end();
  copyFiles(directory)
  cb(dest);
}

/**
 * Copy some files for a preview such as the bundle.js and index.html
 * @param  {String} directory dest
 * @return {void}
 */
function copyFiles(directory) {

  var root     = __dirname.replace('lib',''),
      fileList = ['index.html',path.join('dist','bundle.js')],
      i        = fileList.length,
      file;

  while(--i >= 0) {
    file = fileList[i];

    if(file.split(path.sep).length > 1) {
      mkdirp.sync(path.dirname(path.join(directory, file)));
    }

    fs
      .createReadStream(root + file)
      .pipe(fs.createWriteStream(path.join(directory, file)));
  }


}


module.exports = mkdir;