var importer = require('./index');

test('resolves to node_modules directory when first character is ~', function () {
  expect(importer('~my-module', '')).toEqual({
    file: __dirname + '/node_modules/my-module'
  });
});

test('does nothing when the first character isnt a ~', function () {
  expect(importer('my-module', '')).toEqual({
    file: 'my-module'
  });
});
