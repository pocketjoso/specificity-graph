var fs = require('fs'),
    path = require('path');
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
  cb(dest);
}


module.exports = mkdir;