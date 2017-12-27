jest.mock('fs');

var mockFs = require('fs');
var fsUtil = require('./fs-util');

describe('Fs Util', function() {
  beforeEach(function() {
    mockFs.existsSync.mockReturnValue(true).mockClear();
  });

  describe('.isFileImport()', function() {
    test('mirrors the result of the first file system check', function() {
      var result = fsUtil.isFileImport('my-module1/test-file');
      expect(result).toBeTruthy();
    });

    test('checks the parent directory path for existence', function() {
      var result = fsUtil.isFileImport('my-module2/test-file');
      expect(mockFs.existsSync).toBeCalledWith('my-module2');
    });

    test('caches and reuse the results of file system checks for the same path', function() {
      for (var i = 0; i < 10; i++) {
        fsUtil.isFileImport('my-module3/test-file');
      }

      expect(mockFs.existsSync.mock.calls.length).toBe(1);
    });
  });

  describe('.isDirectoryImport()', function() {
    test('returns false if the path contains extension without calling the file system', function() {
      var result = fsUtil.isDirectoryImport('my-module/test-file.scss');
      expect(result).toBeFalsy();
      expect(mockFs.existsSync).not.toBeCalled();
    });

    test('mirrors the result of the first file system check', function() {
      var result = fsUtil.isDirectoryImport('my-module/test-dir1');
      expect(result).toBeTruthy();
    });

    test('checks the full path for existence', function() {
      var result = fsUtil.isDirectoryImport('my-module/test-dir2');
      expect(mockFs.existsSync).toBeCalledWith('my-module/test-dir2');
    });

    test('caches and reuse the results of file system calls for the same path', function() {
      for (var i = 0; i < 10; i++) {
        fsUtil.isDirectoryImport('test-dir3');
      }

      expect(mockFs.existsSync.mock.calls.length).toBe(1);
    });
  });
});
