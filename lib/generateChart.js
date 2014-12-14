var fs = require('fs'),
    path = require('path');
    mkdirp = require('mkdirp');
    colors = require('cli-color');

function mkdir(directory, data, cb) {
  fs.mkdir(directory, function (err) {
    if(err) {
      console.log(colors.yellow('[specificity-css] The directory already exist'));
    }
    appendData(directory, data, cb);
  });
}

function appendData(directory, data, cb) {

  cb = cb || function(){};
  var dest = path.join(directory, 'specificity.json');
  var out = fs.createWriteStream(dest);
  out.write(new Buffer(JSON.stringify(data)));
  out.end();
  copyFiles(directory)
  cb(dest);
}

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