jest.mock('fs');

var mockFs = require('fs');
var fsUtil = require('./fs-util');

describe('Fs Util', function() {
  describe('.isDirectory()', function() {
    test('path is a directory when the it does not have an extension', function() {
      var result = fsUtil.isDirectory('my-module1/test-dir');
      expect(result).toBeTruthy();
    });

    test('path is not a directory when it does have an extension', function() {
      var result = fsUtil.isDirectory('my-module2/test-file.scss');
      expect(result).toBeFalsy();
    });
  });
});
