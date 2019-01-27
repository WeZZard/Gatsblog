const MDXRelativePathMetadata = require('../../MDXRelativePathMetadata');

test('MDXRelativePathMetadata throws when sourceInstanceName is not of string', () => {
    expect(() => {
        MDXRelativePathMetadata(0, ``)
    }).toThrow();
});

test('MDXRelativePathMetadata throws when relativePath is not of string', () => {
    expect(() => {
        MDXRelativePathMetadata(``, 0)
    }).toThrow();
});

test('MDXRelativePathMetadata throws when sourceInstanceName is not Post or Page', () => {
    expect(() => {
        MDXRelativePathMetadata(``, ``)
    }).toThrow();
});

test('MDXRelativePathMetadata does not throw when sourceInstanceName is Post', () => {
    expect(() => {
        MDXRelativePathMetadata(`Post`, ``)
    }).not.toThrow();
});

test('MDXRelativePathMetadata does not throw when sourceInstanceName is Page', () => {
    expect(() => {
        MDXRelativePathMetadata(`Page`, ``)
    }).not.toThrow();
});
