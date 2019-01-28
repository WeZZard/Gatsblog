const MDXRelativePathMetadata = require('../../MDXRelativePathMetadata');

test('MDXRelativePathMetadata creates metadata for standalone root Page relative path', () => {
    expect(MDXRelativePathMetadata(`Page`, `page-name.md`)).toEqual({
        name: `page-name`,
        documentIdentifier: `page-name`,
        isIndex: false,
        slug: `page-name`,
        isLocalized: false,
    });
});

test('MDXRelativePathMetadata creates metadata for standalone root Page relative path with upper cased letters', () => {
    expect(MDXRelativePathMetadata(`Page`, `Page-Name.md`)).toEqual({
        name: `Page-Name`,
        documentIdentifier: `page-name`,
        isIndex: false,
        slug: `page-name`,
        isLocalized: false,
    });
});

test('MDXRelativePathMetadata creates metadata for standalone non-root Page relative path', () => {
    expect(
        MDXRelativePathMetadata(`Page`, `folder/page-name.md`),
    ).toEqual({
        name: `folder/page-name`,
        documentIdentifier: `folder/page-name`,
        isIndex: false,
        slug: `folder/page-name`,
        isLocalized: false,
    });
});

test('MDXRelativePathMetadata creates metadata for standalone non-root Page relative path with upper cased letters', () => {
    expect(
        MDXRelativePathMetadata(`Page`, `folder/Page-Name.md`),
    ).toEqual({
        name: `folder/Page-Name`,
        documentIdentifier: `folder/page-name`,
        isIndex: false,
        slug: `folder/page-name`,
        isLocalized: false,
    });
});

test('MDXRelativePathMetadata creates metadata for wrapped root Page relative path', () => {
    expect(
        MDXRelativePathMetadata(`Page`, `page-name/index.md`),
    ).toEqual({
        name: `page-name`,
        documentIdentifier: `page-name`,
        isIndex: true,
        slug: `page-name`,
        isLocalized: false,
    });
});

test('MDXRelativePathMetadata creates metadata for wrapped non-root Page relative path', () => {
    expect(
        MDXRelativePathMetadata(`Page`, `folder/page-name/index.md`),
    ).toEqual({
        name: `folder/page-name`,
        documentIdentifier: `folder/page-name`,
        isIndex: true,
        slug: `folder/page-name`,
        isLocalized: false,
    });
});

test('MDXRelativePathMetadata creates metadata for localized root Page relative path', () => {
    expect(
        MDXRelativePathMetadata(`Page`, `page-name/zh/index.md`),
    ).toEqual({
        name: `page-name`,
        documentIdentifier: `page-name`,
        isIndex: true,
        slug: `page-name`,
        lang: `zh`,
        isLocalized: true,
    });
});

test('MDXRelativePathMetadata creates metadata for localized non-root Page relative path', () => {
    expect(
        MDXRelativePathMetadata(
            `Page`,
            `folder/page-name/zh/index.md`,
        ),
    ).toEqual({
        name: `folder/page-name`,
        documentIdentifier: `folder/page-name`,
        isIndex: true,
        slug: `folder/page-name`,
        lang: `zh`,
        isLocalized: true,
    });
});
