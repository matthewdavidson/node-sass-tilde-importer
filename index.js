var path = require('path');
var fs = require('fs');
var findParentDir = require('find-parent-dir');

function isDirectoryImport(filePath) {
  return !path.extname(filePath) && fs.existsSync(filePath);
}

function isFileImport(filePath) {
  return fs.existsSync(path.dirname(filePath));
}

function resolve(targetUrl, source) {
  var packageRoot = findParentDir.sync(source, 'node_modules');

  if (!packageRoot) {
    return null;
  }

  var filePath = path.resolve(packageRoot, 'node_modules', targetUrl);

  if (isDirectoryImport(filePath)) {
    return path.resolve(filePath, 'index');
  } else if (isFileImport(filePath)) {
    return filePath;
  }

  return resolve(targetUrl, path.dirname(packageRoot));
}

module.exports = function importer (url, prev, done) {
  if (url[ 0 ] === '~') {
    url = resolve(url.substr(1), prev);
  }

  return { file: url };
};
