const { _getTitleWithRawMarkdown } = require('../../MDXShims');

test('_getTitleWithRawMarkdown throws when rawBody is not of string', () => {
    expect(() => {
        _getTitleWithRawMarkdown(0)
    }).toThrow();
});

test('_getTitleWithRawMarkdown does not throw when rawBody is of string', () => {
    expect(() => {
        _getTitleWithRawMarkdown(``)
    }).not.toThrow();
});

test('_getTitleWithRawMarkdown does not throw when rawBody is null', () => {
    expect(() => {
        _getTitleWithRawMarkdown(null)
    }).not.toThrow();
});

test('_getTitleWithRawMarkdown does not throw when rawBody is undefined', () => {
    expect(() => {
        _getTitleWithRawMarkdown(undefined)
    }).not.toThrow();
});

test('_getTitleWithRawMarkdown returns the #1 heading when the rawBody contains the #1 heading at the beginning of the document', () => {
    expect(_getTitleWithRawMarkdown(`# Title`)).toBe(`Title`);
});

test('_getTitleWithRawMarkdown returns null when the rawBody contains the #1 heading but not at the beginning of the document', () => {
    expect(_getTitleWithRawMarkdown(`Anything\n# Title`)).toBeNull();
});

test('_getTitleWithRawMarkdown returns null when the rawBody does not contain anything', () => {
    expect(_getTitleWithRawMarkdown(``)).toBeNull();
});
