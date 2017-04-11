var path = require('path');
var fs = require('fs');
var findParentDir = require('find-parent-dir');

function resolve(targetUrl, source) {
  // Use the current directory if the path is not set
  if (source === 'stdin') source = process.cwd();

  var packageRoot = findParentDir.sync(source, 'node_modules');

  if (!packageRoot) {
    return null;
  }

  var filePath = path.resolve(packageRoot, 'node_modules', targetUrl);

  return fs.existsSync(path.dirname(filePath))
    ? filePath
    : resolve(targetUrl, path.dirname(packageRoot));
}

module.exports = function importer (url, prev, done) {
  if (url[ 0 ] === '~') {
    url = resolve(url.substr(1), prev);
  }

  return { file: url };
};
