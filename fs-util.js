var fs = require('fs');
var path = require('path');

function isDirectory(filePath) {
  return !path.extname(filePath);
}

module.exports = {
  existsSync: fs.existsSync,
  isDirectory: isDirectory
};
