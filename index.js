var path = require('path');
var fs = require('fs');
var findParentDir = require('find-parent-dir');

/**
 * Resolves the url in the nearest node_module directory
 * @param {String} targetUrl url to resolve
 * @param {String} sourceFile file which is referring to the targetUrl
 * @returns file path or false if the file does not exist
 */
function resolveDeep(targetUrl, sourceFile) {
  var packageRoot = findParentDir.sync(sourceFile, 'node_modules');
  var filePath = path.resolve(packageRoot, 'node_modules', targetUrl);

  return fs.existsSync(path.dirname(filePath)) && filePath;
}

/**
 * Resolves the url in the top level node_module directory
 * @param {String} targetUrl url to resolve
 */
function resolveFlat(targetUrl) {
  return path.resolve('node_modules', targetUrl);
}

module.exports = function importer (url, prev, done) {
  if (url[ 0 ] === '~') {
    var targetUrl = url.substr(1);
    url = resolveDeep(targetUrl, prev) || resolveFlat(targetUrl);
  }

  return { file: url };
};
