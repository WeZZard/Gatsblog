const { getDocumentType } = require('../../MDXShims');

test('getDocumentType throws when sourceInstanceName is not of string', () => {
    expect(() => {
        getDocumentType(0)
    }).toThrow();
});

test('getDocumentType does not throw when sourceInstanceName is of string', () => {
    expect(() => {
        getDocumentType(``)
    }).not.toThrow();
});

test('getDocumentType returns Post when the sourceInstanceName is Post', () => {
    expect(getDocumentType(`Post`)).toBe(`Post`);
});

test('getDocumentType returns Page when the sourceInstanceName is Page', () => {
    expect(getDocumentType(`Page`)).toBe(`Page`);
});

test('getDocumentType returns undefined the sourceInstanceName is not Page or Post', () => {
    expect(getDocumentType(``)).toBeUndefined();
});
