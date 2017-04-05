jest.mock("fs");
jest.mock("find-parent-dir");

var importer = require('./index');
var fs = require('fs');
var findParentDir = require('find-parent-dir');

beforeEach(function() {
  fs.existsSync.mockReturnValue(true);
  findParentDir.sync.mockReturnValue('test');
});

test('resolves to node_modules directory when first character is ~', function() {
  expect(importer('~my-module', '')).toEqual({ file: __dirname + '/test/node_modules/my-module' });
});

test('does nothing when the first character isnt a ~', function() {
  expect(importer('my-module', '')).toEqual({ file: 'my-module' });
});

test('recursively resolve url until package has not been found', function() {
  var mockFsCheck = fs.existsSync,
      mockParentDirFinder = findParentDir.sync;

  // url can not be resolved up to 10 level
  for (var i = 0; i < 10; i++) {
    mockFsCheck = mockFsCheck.mockReturnValueOnce(false);
    mockParentDirFinder = mockParentDirFinder.mockReturnValueOnce('test' + i);
  }

  // url finally found
  mockFsCheck.mockReturnValueOnce(true);
  mockParentDirFinder.mockReturnValueOnce('final');

  expect(importer('~my-module', '')).toEqual({ file: __dirname + '/final/node_modules/my-module' });
});

test('return null when package file can not be resolved', function() {
  fs.existsSync.mockReturnValue(false)
  findParentDir.sync.mockReturnValue(null);

  expect(importer('~my-module', '')).toBeNull();
});
