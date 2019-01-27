const { _getSubtitleWithRawMarkdown } = require('../../MDXShims');

test('_getSubtitleWithRawMarkdown throws when rawBody is not of string', () => {
    expect(() => {
        _getSubtitleWithRawMarkdown(0)
    }).toThrow();
});

test('_getSubtitleWithRawMarkdown does not throw when rawBody is of string', () => {
    expect(() => {
        _getSubtitleWithRawMarkdown(``)
    }).not.toThrow();
});

test('_getSubtitleWithRawMarkdown does not throw when rawBody is null', () => {
    expect(() => {
        _getSubtitleWithRawMarkdown(null)
    }).not.toThrow();
});

test('_getSubtitleWithRawMarkdown does not throw when rawBody is undefined', () => {
    expect(() => {
        _getSubtitleWithRawMarkdown(undefined)
    }).not.toThrow();
});

test('_getSubtitleWithRawMarkdown returns the second #1 heading when the rawBody contains the second #1 heading follows the first #1 heading which at the beginning of the document', () => {
    expect(_getSubtitleWithRawMarkdown(`# Title\n# Subtitle`)).toBe(`Subtitle`);
});

test('_getSubtitleWithRawMarkdown returns null when the rawBody contains the second #1 heading but the preceding first #1 heading not at the beginning of the document', () => {
    expect(_getSubtitleWithRawMarkdown(`Anything\n# Title\n# Subtitle`)).toBeNull();
});

test('_getSubtitleWithRawMarkdown returns null when the rawBody does not contain anything', () => {
    expect(_getSubtitleWithRawMarkdown(``)).toBeNull();
});
