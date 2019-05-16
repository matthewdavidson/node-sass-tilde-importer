var path = require('path');
var findParentDir = require('find-parent-dir');
var fs = require('fs');

function resolve(targetUrl, source) {
  var packageRoot = findParentDir.sync(source, 'node_modules');

  if (!packageRoot) {
    return null;
  }

  var filePath = path.resolve(packageRoot, 'node_modules', targetUrl);
  var isPotentiallyDirectory = !path.extname(filePath);

  if (isPotentiallyDirectory) {
    if (fs.existsSync(filePath + '.scss')) {
      return filePath + '.scss';
    }

    var partialName = '_' + path.basename(filePath) + '.scss';
    var dir = path.dirname(filePath);
    var partialPath = path.join(dir, partialName);
    if (fs.existsSync(partialPath)) {
      return partialPath;
    }

    if (fs.existsSync(filePath)) {
      return path.resolve(filePath, 'index');
    }
  }

  if (fs.existsSync(path.dirname(filePath))) {
    return filePath;
  }

  return resolve(targetUrl, path.dirname(packageRoot));
}

module.exports = function importer (url, prev, done) {
  return (url[ 0 ] === '~') ? { file: resolve(url.substr(1), prev) } : null;
};
