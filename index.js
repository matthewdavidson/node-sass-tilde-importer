var path = require('path');
var findParentDir = require('find-parent-dir');
var fs = require('fs');

function sassFileExists(filePath) {
  if (!filePath.endsWith('.scss')) {
    filePath = filePath + '.scss';
  }
  if (fs.existsSync(filePath)) { // e.g. file.scss  - regular file
    return true;
  }
  var fileName = path.basename(filePath);
  var directory = path.dirname(filePath);
  var partialFilePath = path.join(directory, '_' + fileName);
  if (fs.existsSync(partialFilePath)) { // e.g. _file.scss  - partials
    return true;
  }
  return false;
}

function resolve(targetUrl, source) {
  var packageRoot = findParentDir.sync(source, 'node_modules');

  if (!packageRoot) {
    return null;
  }

  var filePath = path.resolve(packageRoot, 'node_modules', targetUrl);

  var isPotentiallyDirectory = !path.extname(filePath);
  var directoryPath = path.join(filePath, 'index');
  if (isPotentiallyDirectory && fs.existsSync(directoryPath)) {
    return directoryPath;
  }

  if (sassFileExists(filePath)) {
    return filePath;
  }

  return resolve(targetUrl, path.dirname(packageRoot));
}

module.exports = function importer (url, prev, done) {
  return (url[ 0 ] === '~') ? { file: resolve(url.substr(1), prev) } : 
null;
};

