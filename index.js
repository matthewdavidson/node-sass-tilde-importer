var path = require('path');
var findParentDir = require('find-parent-dir');
var fs = require('fs');

function resolveFileWithoutExtension(filePath) {
  if (fs.existsSync(filePath + '.scss')) {
    return filePath + '.scss';
  }

  if (fs.existsSync(filePath)) {
    return path.resolve(filePath, 'index');
  }
}

function resolve(targetUrl, source) {
  var packageRoot = findParentDir.sync(source, 'node_modules');

  if (!packageRoot) {
    return null;
  }

  var filePath = path.resolve(packageRoot, 'node_modules', targetUrl);

  if (!path.extname(filePath)) {
    var scssPath = resolveFileWithoutExtension(filePath);

    if (scssPath) {
      return scssPath;
    }
  }

  if (fs.existsSync(path.dirname(filePath))) {
    return filePath;
  }

  return resolve(targetUrl, path.dirname(packageRoot));
}

module.exports = function importer (url, prev, done) {
  return url[ 0 ] === '~' ? { file: resolve(url.substr(1), prev) } : null;
};
