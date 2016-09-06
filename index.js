var path = require('path');
var findParentDir = require('find-parent-dir');

module.exports = function importer (url, prev, done) {
  if (url[ 0 ] === '~') {
    var packageRoot = findParentDir.sync(prev, 'node_modules') || __dirname;
    url = path.resolve(packageRoot, 'node_modules', url.substr(1));
  }

  return { file: url };
};
