var mockFs = require('fs');
var fsUtil = require('./fs-util');

jest.mock('fs');

describe('Fs Util', function() {
  beforeEach(function() {
    mockFs.existsSync.mockReturnValue(true).mockClear();
  });

  describe('.isFileImport()', function() {
    test('calls file system check with parent directory path', function() {
      var result = fsUtil.isFileImport('my-module/test-file1');
      expect(mockFs.existsSync).toBeCalledWith('my-module');
    });

    test('mirrors the result of the first file system check', function() {
      var result = fsUtil.isFileImport('my-module/test-file2');
      expect(result).toBeTruthy();
    });

    test('caches and reuse the results of fs checks', function() {
      for (var i = 0; i < 10; i++) {
        fsUtil.isFileImport('test-file3');
      }

      expect(mockFs.existsSync.mock.calls.length).toBe(1);
    });
  });

  describe('.isDirectoryImport()', function() {
    test('returns false if the path has extension without calling file system', function() {
      var result = fsUtil.isDirectoryImport('my-module/test-file.scss');
      expect(result).toBeFalsy();
      expect(mockFs.existsSync).not.toBeCalled();
    });

    test('mirrors the result of the first file system check', function() {
      var result = fsUtil.isDirectoryImport('my-module/test-dir1');
      expect(result).toBeTruthy();
    });

    test('returns the result of standard existsSync call', function() {
      var result = fsUtil.isDirectoryImport('my-module/test-dir2');
      expect(mockFs.existsSync).toBeCalledWith('my-module/test-dir2');
    });

    test('caches and reuse the results of fs checks', function() {
      for (var i = 0; i < 10; i++) {
        fsUtil.isDirectoryImport('test-dir3');
      }

      expect(mockFs.existsSync.mock.calls.length).toBe(1);
    });
  });
});
