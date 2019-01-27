const { getCreatedTime } = require('../../MDXShims');

test('getCreatedTime throws when frontMatterDate is not of type Date', () => {
    expect(() => {
        getCreatedTime(`1990-01-01`, new Date(`1990-01-02`), new Date(`1990-01-03`))
    }).toThrow();
});

test('getCreatedTime does not throw when frontMatterDate is null', () => {
    expect(() => {
        getCreatedTime(null, new Date(`1990-01-02`), new Date(`1990-01-03`))
    }).not.toThrow();
});

test('getCreatedTime does not throw when frontMatterDate is undefined', () => {
    expect(() => {
        getCreatedTime(undefined, new Date(`1990-01-02`), new Date(`1990-01-03`))
    }).not.toThrow();
});

test('getCreatedTime throws when documentNameDate is not of type Date', () => {
    expect(() => {
        getCreatedTime(new Date(`1990-01-01`), `1990-01-02`, new Date(`1990-01-03`))
    }).toThrow();
});

test('getCreatedTime does not when documentNameDate is null', () => {
    expect(() => {
        getCreatedTime(new Date(`1990-01-01`), null, new Date(`1990-01-03`))
    }).not.toThrow();
});

test('getCreatedTime does not when documentNameDate is undefined', () => {
    expect(() => {
        getCreatedTime(new Date(`1990-01-01`), undefined, new Date(`1990-01-03`))
    }).not.toThrow();
});

test('getCreatedTime throws when birthTime is not of type Date', () => {
    expect(() => {
        getCreatedTime(new Date(`1990-01-01`), new Date(`1990-01-02`), `1990-01-03`)
    }).toThrow();
});

test('getCreatedTime does not when birthTime is null', () => {
    expect(() => {
        getCreatedTime(new Date(`1990-01-01`), new Date(`1990-01-02`), null)
    }).not.toThrow();
});

test('getCreatedTime does not when birthTime is undefined', () => {
    expect(() => {
        getCreatedTime(new Date(`1990-01-01`), new Date(`1990-01-02`), undefined)
    }).not.toThrow();
});

test('getCreatedTime returns frontMatterDate when frontMatterDate is given', () => {
    expect(getCreatedTime(new Date(`1990-01-01`), new Date(`1990-01-20`), new Date(`1990-01-03`))).toEqual(new Date(`1990-01-01`));
});

test('getCreatedTime returns documentNameDate when documentNameDate is given and frontMatterDate is not given', () => {
    expect(getCreatedTime(null, new Date(`1990-01-02`), new Date(`1990-01-03`))).toEqual(new Date(`1990-01-02`));
});

test('getCreatedTime returns birthTime when birthTime is given and frontMatterDate and documentNameDate is both not given', () => {
    expect(getCreatedTime(null, null, new Date(`1990-01-03`))).toEqual(new Date(`1990-01-03`));
});
