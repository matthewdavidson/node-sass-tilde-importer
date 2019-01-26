jest.mock('find-parent-dir');
jest.mock('fs');

var importer = require('./');
var mockFs = require('fs');
var mockFindParentDir = require('find-parent-dir');

describe('Importer', function() {
  beforeEach(function() {
    mockFs.existsSync.mockClear();
    mockFindParentDir.sync.mockReturnValue('MOCK_PARENT_DIR').mockClear();
  });

  test('resolves to node_modules directory when first character is ~', function() {
    mockFs.existsSync.mockReturnValueOnce(false).mockReturnValue(true);
    expect(importer('~my-module', '')).toEqual({
      file: __dirname + '/MOCK_PARENT_DIR/node_modules/my-module/index'
    });
  });

  test('does nothing when the first character isnt a ~', function() {
    expect(importer('my-module', '')).toEqual(null);
  });

  test('recursively resolve url until package has not been found', function() {
    var mockFsCheck = mockFs.existsSync,
    mockParentDirFinder = mockFindParentDir.sync;

    // url can not be resolved up to 10 level
    for (var i = 0; i < 10; i++) {
      mockFsCheck = mockFsCheck
        .mockReturnValueOnce(false) // .scss import
        .mockReturnValueOnce(false) // directory import
        .mockReturnValueOnce(false); // file import

      mockParentDirFinder = mockParentDirFinder.mockReturnValueOnce('MOCK_PARENT_DIR' + i);
    }

    // url finally found
    mockFsCheck = mockFsCheck
      .mockReturnValueOnce(false) // .scss import
      .mockReturnValueOnce(false) // directory import
      .mockReturnValueOnce(true); // file import
    mockParentDirFinder = mockParentDirFinder.mockReturnValueOnce('MOCK_PARENT_DIR_final');

    expect(importer('~my-module/test', '')).toEqual({
      file: __dirname + '/MOCK_PARENT_DIR_final/node_modules/my-module/test'
    });

    expect(mockParentDirFinder.mock.calls.length).toBe(11);
    expect(mockFsCheck.mock.calls.length).toBe(33);
  });

  test('return null when package file can not be resolved', function() {
    mockFs.existsSync.mockReturnValue(false);
    mockFindParentDir.sync.mockReturnValue(null);
    expect(importer('~my-module', '')).toEqual({ file: null });
  });

  test('should resolve extensions', function() {
    mockFs.existsSync
      .mockReturnValueOnce(false) // .scss import
      .mockReturnValueOnce(true); // directory import

    expect(importer('~my-module/test.scss', '')).toEqual({
      file: __dirname + '/MOCK_PARENT_DIR/node_modules/my-module/test.scss'
    });
  });

  test('should support file imports', function() {
    mockFs.existsSync
      .mockReturnValueOnce(false) // .scss import
      .mockReturnValueOnce(false) // directory import
      .mockReturnValueOnce(true); // file import

    expect(importer('~my-module/test', '')).toEqual({
      file: __dirname + '/MOCK_PARENT_DIR/node_modules/my-module/test'
    });
  });

  test('should support directory imports', function() {
    mockFs.existsSync
      .mockReturnValueOnce(false) // .scss import
      .mockReturnValueOnce(true); // directory import

    expect(importer('~my-module/test', '')).toEqual({
      file: __dirname + '/MOCK_PARENT_DIR/node_modules/my-module/test/index'
    });
  });

  test('should support directory imports', function() {
    mockFs.existsSync.mockReturnValueOnce(true); // .scss import

    expect(importer('~my-module/test', '')).toEqual({
      file: __dirname + '/MOCK_PARENT_DIR/node_modules/my-module/test.scss'
    });
  });
});
