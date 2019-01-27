const { getTitle } = require('../../MDXShims');

test('getTitle throws when frontMatterTitle is not of string', () => {
    expect(() => {
        getTitle(0, ``, ``)
    }).toThrow();
});

test('getTitle does not throw when frontMatterTitle is null', () => {
    expect(() => {
        getTitle(null, ``, ``)
    }).not.toThrow();
});

test('getTitle does not throw when frontMatterTitle is undefined', () => {
    expect(() => {
        getTitle(undefined, ``, ``)
    }).not.toThrow();
});

test('getTitle throws when rawBody is not of string', () => {
    expect(() => {
        getTitle(``, 0, `documentName`)
    }).toThrow();
});

test('getTitle does not throw when rawBody is null', () => {
    expect(() => {
        getTitle(``, null, ``)
    }).not.toThrow();
});

test('getTitle does not throw when rawBody is undefined', () => {
    expect(() => {
        getTitle(``, undefined, ``)
    }).not.toThrow();
});

test('getTitle throws when documentName is not of string', () => {
    expect(() => {
        getTitle(``, ``, 0)
    }).toThrow();
});

test('getTitle does not throw when documentName is null', () => {
    expect(() => {
        getTitle(``, ``, null)
    }).not.toThrow();
});

test('getTitle does not throw when documentName is undefined', () => {
    expect(() => {
        getTitle(``, ``, undefined)
    }).not.toThrow();
});

test('getTitle returns frontMatterTitle when frontMatterTitle is given', () => {
    expect(getTitle(`frontMatterTitle`, `rawBody`, `documentName`)).toBe(`frontMatterTitle`);
});

test('getTitle returns the #1 heading of rawBody when rawBody is given and frontMatterTitle is not given', () => {
    expect(getTitle(null ,`# Raw Body`, `documentName`)).toBe(`Raw Body`);
});

test('getTitle returns the document name when rawBody is given but no #1 heading located at the beginning of the document and frontMatterTitle is not given', () => {
    expect(getTitle(null, `rawBody`, `documentName`)).toBe(`documentName`);
});

test('getTitle returns documentName when documentName is given and frontMatterTitle and rawBody is both not given', () => {
    expect(getTitle(null, null, `documentName`)).toBe(`documentName`);
});

test('getTitle returns an empty string when all the arguments are not given', () => {
    expect(getTitle(null, null, null)).toBe("");
});
