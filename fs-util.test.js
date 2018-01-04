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

  describe('.existsSync()', function() {
    beforeEach(function() {
      mockFs.existsSync.mockClear();
    });

    test('mirrors the result of the file system calls', function() {
      mockFs.existsSync.mockReturnValue(true);
      expect(fsUtil.existsSync('my-module1/test-file-true')).toBeTruthy();

      mockFs.existsSync.mockReturnValue(false);
      expect(fsUtil.existsSync('my-module1/test-file-false')).toBeFalsy();
    });

    test('caches and reuse the results of file system checks for the same path', function() {
      for (var i = 0; i < 10; i++) {
        fsUtil.existsSync('my-module3/test-file');
      }

      expect(mockFs.existsSync.mock.calls.length).toBe(1);
    });
  });
});
