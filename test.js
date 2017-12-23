jest.mock('fs');
jest.mock('find-parent-dir');

var importer = require('./index');
var fs = require('fs');
var findParentDir = require('find-parent-dir');

beforeEach(function() {
  fs.existsSync.mockClear();
  fs.existsSync.mockReturnValue(true);

  findParentDir.sync.mockClear();
  findParentDir.sync.mockReturnValue('MOCK_PARENT_DIR');
});

test('resolves to node_modules directory when first character is ~', function() {
  expect(importer('~my-module', '')).toEqual({
     file: __dirname + '/MOCK_PARENT_DIR/node_modules/my-module/index'
  });
});

test('does nothing when the first character isnt a ~', function() {
  expect(importer('my-module', '')).toEqual({ file: 'my-module' });
});

test('recursively resolve url until package has not been found', function() {
  var mockFsCheck = fs.existsSync,
      mockParentDirFinder = findParentDir.sync;

  // url can not be resolved up to 10 level
  for (var i = 0; i < 10; i++) {
    mockFsCheck = mockFsCheck.mockReturnValueOnce(false)
                             .mockReturnValueOnce(false);

    mockParentDirFinder = mockParentDirFinder.mockReturnValueOnce('MOCK_PARENT_DIR' + i);
  }

  // url finally found
  mockFsCheck = mockFsCheck.mockReturnValueOnce(false)
                           .mockReturnValueOnce(true);

  mockParentDirFinder = mockParentDirFinder.mockReturnValueOnce('MOCK_PARENT_DIR_final');

  expect(importer('~my-module/test', '')).toEqual({
    file: __dirname + '/MOCK_PARENT_DIR_final/node_modules/my-module/test'
  });

  expect(mockParentDirFinder.mock.calls.length).toBe(11);
  expect(mockFsCheck.mock.calls.length).toBe(22);
});

test('return null when package file can not be resolved', function() {
  fs.existsSync.mockReturnValue(false)
  findParentDir.sync.mockReturnValue(null);

  expect(importer('~my-module', '')).toEqual({ file: null });
});

test('should resolve extensions', function() {
  expect(importer('~my-module/test.scss', '')).toEqual({
    file: __dirname + '/MOCK_PARENT_DIR/node_modules/my-module/test.scss'
  });
});
