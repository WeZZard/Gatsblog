const {
    getDocumentType,
    _getTitleWithRawMarkdown,
    getTitle,
    getSubtitle,
    getCreatedTime
} = require('./MDXShims');

// MARK: - getDocumentType

test('getDocumentType returns Post when the sourceInstanceName is Post', () => {
    expect(getDocumentType(`Post`)).toBe(`Post`);
});

test('getDocumentType returns Page when the sourceInstanceName is Page', () => {
    expect(getDocumentType(`Page`)).toBe(`Page`);
});

test('getDocumentType returns undefined the sourceInstanceName is not Page or Post', () => {
    expect(getDocumentType(`BlahBlahBlah`)).toBeUndefined();
});

// MARK: - _getTitleWithRawMarkdown
test('_getTitleWithRawMarkdown returns the first heading when the rawBody contains the first heading at the beginning of the document', () => {
    expect(_getTitleWithRawMarkdown(`# Title`)).toBe(`Title`);
});

test('_getTitleWithRawMarkdown returns null when the rawBody contains the first heading but not at the beginning of the document', () => {
    expect(_getTitleWithRawMarkdown(`Anything\n# Title`)).toBeNull();
});

test('_getTitleWithRawMarkdown returns null when the rawBody does not contain anything', () => {
    expect(_getTitleWithRawMarkdown(``)).toBeNull();
});

// MARK: - getTitle
test('getTitle returns frontMatterTitle when frontMatterTitle is given', () => {
    expect(getTitle(`frontMatterTitle`, `rawBody`, `documentName`)).toBe(`frontMatterTitle`);
});

test('getTitle returns the first heading of rawBody when rawBody is given and frontMatterTitle is not given', () => {
    expect(getTitle(null ,`# Raw Body`, `documentName`)).toBe(`Raw Body`);
});

test('getTitle returns the document name when rawBody is given but no first heading located at the beginning of the document and frontMatterTitle is not given', () => {
    expect(getTitle(null, `rawBody`, `documentName`)).toBe(`documentName`);
});

test('getTitle returns documentName when documentName is given and frontMatterTitle and rawBody is both not given', () => {
    expect(getTitle(null, null, `documentName`)).toBe(`documentName`);
});

test('getTitle returns an empty string when all the arguments are not given', () => {
    expect(getTitle(null, null, null)).toBe("");
});

// MARK: - getSubtitle
test('getSubtitle returns frontMatterTitle when frontMatterTitle is given', () => {
    expect(getSubtitle(`frontMatterTitle`, `rawBody`)).toBe(`frontMatterTitle`);
});

test('getSubtitle returns the first heading of rawBody when rawBody is given and frontMatterTitle is not given', () => {
    expect(getSubtitle(null ,`# Raw Body\n# Subtitle`)).toBe(`Subtitle`);
});

test('getSubtitle returns an empty string when rawBody is given but no first heading located at the beginning of the frontMatterTitle is not given', () => {
    expect(getSubtitle(null, `rawBody`)).toBe("");
});

// MARK: - getCreatedTime
test('getCreatedTime returns frontMatterDate when frontMatterDate is given', () => {
    expect(getCreatedTime(new Date(`1990-1-1`), new Date(`1990-1-2`), new Date(`1990-1-3`))).toEqual(new Date(`1990-1-1`));
});

test('getCreatedTime returns documentNameDate when documentNameDate is given and frontMatterDate is not given', () => {
    expect(getCreatedTime(null, new Date(`1990-1-2`), new Date(`1990-1-3`))).toEqual(new Date(`1990-1-2`));
});

test('getCreatedTime returns birthTime when birthTime is given and frontMatterDate and documentNameDate is both not given', () => {
    expect(getCreatedTime(null, null, new Date(`1990-1-3`))).toEqual(new Date(`1990-1-3`));
});
