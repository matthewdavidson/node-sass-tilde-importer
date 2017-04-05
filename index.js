var path = require('path');
var fs = require('fs');
var findParentDir = require('find-parent-dir');

/**
 * Resolves the url in the top level node_module directory
 * @param {String} targetUrl url to resolve
 * @param {String} source file or directory which is the base point resolving targetUrl
 */
function resolve(targetUrl, source) {
  var packageRoot = findParentDir.sync(source, 'node_modules');

  if (!packageRoot) {
    return null; // file could not be resolved as npm package
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

  return url && { file: url };
};
