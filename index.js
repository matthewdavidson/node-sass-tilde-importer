var path = require('path');
var findParentDir = require('find-parent-dir');
var fsUtil = require('./fs-util');

function resolve(targetUrl, source) {
  var packageRoot = findParentDir.sync(source, 'node_modules');

  if (!packageRoot) {
    return null;
  }

  var filePath = path.resolve(packageRoot, 'node_modules', targetUrl);

  if (fsUtil.isDirectory(filePath) && fsUtil.existsSync(filePath)) {
    return path.resolve(filePath, 'index');
  } else if (fsUtil.existsSync(path.dirname(filePath))) {
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
