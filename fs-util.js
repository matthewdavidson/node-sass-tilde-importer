var fs = require('fs');
var path = require('path');

var IMPORT_CACHE = {};

/**
 * Checks for file path for existence and save the result in cache to speed up the next check for the same path.
 * USE CASE: prevent fs calls for the same folder when importing various sass files from a single module (e.g bootstrap)
 * - module/label.scss
 * - module/button.scss
 * @param {String} filePath - path to check for existence
 */
function existsSync(filePath) {
  if (!(filePath in IMPORT_CACHE)) {
    IMPORT_CACHE[filePath] = fs.existsSync(filePath);
  }

  return IMPORT_CACHE[filePath];
}

function isDirectory(filePath) {
  return !path.extname(filePath);
}

module.exports = {
  existsSync: existsSync,
  isDirectory: isDirectory
};
