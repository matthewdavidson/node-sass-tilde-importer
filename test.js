jest.mock("fs");
jest.mock("find-parent-dir");

var importer = require('./index');
var fs = require('fs');
var findParentDir = require('find-parent-dir');

beforeEach(function() {
  fs.existsSync.mockReturnValue(true);
  findParentDir.sync.mockReturnValue('test');
});

test('resolves to node_modules directory when first character is ~', function () {
  expect(importer('~my-module', '')).toEqual({ file: __dirname + '/test/node_modules/my-module' });
});

test('does nothing when the first character isnt a ~', function () {
  expect(importer('my-module', '')).toEqual({ file: 'my-module' });
});

test('fallback to flat resolve if deep failed', function() {
  fs.existsSync.mockReturnValue(false);
  expect(importer('~my-module', '')).toEqual({ file: __dirname + '/node_modules/my-module' });
});
