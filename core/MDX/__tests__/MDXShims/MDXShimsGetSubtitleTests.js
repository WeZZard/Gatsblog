const { getSubtitle } = require('../../MDXShims');

test('getSubtitle throws when frontMatterTitle is not of string', () => {
    expect(() => {
        getSubtitle(0, ``)
    }).toThrow();
});

test('getSubtitle does not throw when frontMatterTitle is null', () => {
    expect(() => {
        getSubtitle(null, ``)
    }).not.toThrow();
});

test('getSubtitle does not throw when frontMatterTitle is undefined', () => {
    expect(() => {
        getSubtitle(undefined, ``)
    }).not.toThrow();
});

test('getSubtitle throws when rawBody is not of string', () => {
    expect(() => {
        getSubtitle(``, 0)
    }).toThrow();
});

test('getSubtitle does not throw when rawBody is null', () => {
    expect(() => {
        getSubtitle(``, null)
    }).not.toThrow();
});

test('getSubtitle does not throw when rawBody is undefined', () => {
    expect(() => {
        getSubtitle(``, undefined)
    }).not.toThrow();
});

test('getSubtitle returns frontMatterTitle when frontMatterTitle is given', () => {
    expect(getSubtitle(`frontMatterTitle`, `rawBody`)).toBe(`frontMatterTitle`);
});

test('getSubtitle returns the #1 heading of rawBody when rawBody is given and frontMatterTitle is not given', () => {
    expect(getSubtitle(null ,`# Raw Body\n# Subtitle`)).toBe(`Subtitle`);
});

test('getSubtitle returns an empty string when rawBody is given but no #1 heading located at the beginning of the frontMatterTitle is not given', () => {
    expect(getSubtitle(null, `rawBody`)).toBe("");
});
