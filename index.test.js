jest.mock('find-parent-dir');
jest.mock('./fs-util');

var importer = require('./index');
var mockFsUtil = require('./fs-util');
var mockFindParentDir = require('find-parent-dir');

describe('Importer', function() {
  beforeEach(function() {
    mockFsUtil.isDirectoryImport.mockReturnValue(false).mockClear();
    mockFsUtil.isFileImport.mockReturnValue(false).mockClear();
    mockFindParentDir.sync.mockReturnValue('MOCK_PARENT_DIR').mockClear();
  });

  test('resolves to node_modules directory when first character is ~', function() {
    mockFsUtil.isDirectoryImport.mockReturnValue(true);
    expect(importer('~my-module', '')).toEqual({
      file: __dirname + '/MOCK_PARENT_DIR/node_modules/my-module/index'
    });
  });

  test('does nothing when the first character isnt a ~', function() {
    expect(importer('my-module', '')).toEqual({ file: 'my-module' });
  });

  test('recursively resolve url until package has not been found', function() {
    var mockFsCheck = mockFsUtil.isFileImport,
    mockParentDirFinder = mockFindParentDir.sync;

    // url can not be resolved up to 10 level
    for (var i = 0; i < 10; i++) {
      mockFsCheck = mockFsCheck.mockReturnValueOnce(false);
      mockParentDirFinder = mockParentDirFinder.mockReturnValueOnce('MOCK_PARENT_DIR' + i);
    }

    // url finally found
    mockFsCheck = mockFsCheck.mockReturnValueOnce(true);
    mockParentDirFinder = mockParentDirFinder.mockReturnValueOnce('MOCK_PARENT_DIR_final');

    expect(importer('~my-module/test', '')).toEqual({
      file: __dirname + '/MOCK_PARENT_DIR_final/node_modules/my-module/test'
    });

    expect(mockParentDirFinder.mock.calls.length).toBe(11);
    expect(mockFsCheck.mock.calls.length).toBe(11);
  });

  test('return null when package file can not be resolved', function() {
    mockFindParentDir.sync.mockReturnValue(null);
    expect(importer('~my-module', '')).toEqual({ file: null });
  });

  test('should resolve extensions', function() {
    mockFsUtil.isFileImport.mockReturnValue(true);
    expect(importer('~my-module/test.scss', '')).toEqual({
      file: __dirname + '/MOCK_PARENT_DIR/node_modules/my-module/test.scss'
    });
  });
});
