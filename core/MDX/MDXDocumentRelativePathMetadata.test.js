const MDXDocumentRelativePathMetadata = require('./MDXDocumentRelativePathMetadata');

// MARK: - Page

test('MDXDocumentRelativePathMetadata creates metadata for standalone root Page relative path', () => {
    expect(MDXDocumentRelativePathMetadata(`Page`, `page-name.md`)).toEqual({
        name: `page-name`,
        documentIdentifier: `page-name`,
        isIndex: false,
        slug: `page-name`,
    });
});

test('MDXDocumentRelativePathMetadata creates metadata for wrapped root Page relative path', () => {
    expect(
        MDXDocumentRelativePathMetadata(`Page`, `page-name/index.md`),
    ).toEqual({
        name: `page-name`,
        documentIdentifier: `page-name`,
        isIndex: true,
        slug: `page-name`,
    });
});

test('MDXDocumentRelativePathMetadata creates metadata for localized root Page relative path', () => {
    expect(
        MDXDocumentRelativePathMetadata(`Page`, `page-name/zh/index.md`),
    ).toEqual({
        name: `page-name`,
        documentIdentifier: `page-name`,
        locale: `zh`,
        isIndex: true,
        slug: `zh/page-name`,
    });
});

test('MDXDocumentRelativePathMetadata creates metadata for standalone non-root Page relative path', () => {
    expect(
        MDXDocumentRelativePathMetadata(`Page`, `folder/page-name.md`),
    ).toEqual({
        name: `folder/page-name`,
        documentIdentifier: `folder/page-name`,
        isIndex: false,
        slug: `folder/page-name`,
    });
});

test('MDXDocumentRelativePathMetadata creates metadata for wrapped non-root Page relative path', () => {
    expect(
        MDXDocumentRelativePathMetadata(`Page`, `folder/page-name/index.md`),
    ).toEqual({
        name: `folder/page-name`,
        documentIdentifier: `folder/page-name`,
        isIndex: true,
        slug: `folder/page-name`,
    });
});

test('MDXDocumentRelativePathMetadata creates metadata for localized non-root Page relative path', () => {
    expect(
        MDXDocumentRelativePathMetadata(
            `Page`,
            `folder/page-name/zh/index.md`,
        ),
    ).toEqual({
        name: `folder/page-name`,
        documentIdentifier: `folder/page-name`,
        locale: `zh`,
        isIndex: true,
        slug: `zh/folder/page-name`,
    });
});

// MARK: - Post

test('MDXDocumentRelativePathMetadata creates metadata for standalone Post relative path of valid date', () => {
    expect(
        MDXDocumentRelativePathMetadata(`Post`, `1990-01-02-post-name.md`),
    ).toEqual({
        name: `post-name`,
        documentIdentifier: `1990-01-02-post-name`,
        isIndex: false,
        createdTime: new Date(`1990-01-02`),
        slug: `1990-01-02-post-name`,
    });
});

test('MDXDocumentRelativePathMetadata creates metadata for wrapped Post relative path of valid date', () => {
    expect(
        MDXDocumentRelativePathMetadata(
            `Post`,
            `1990-01-02-post-name/index.md`,
        ),
    ).toEqual({
        name: `post-name`,
        documentIdentifier: `1990-01-02-post-name`,
        isIndex: true,
        createdTime: new Date(`1990-01-02`),
        slug: `1990-01-02-post-name`,
    });
});

test('MDXDocumentRelativePathMetadata creates metadata for localized wrapped Post relative path of valid date', () => {
    expect(
        MDXDocumentRelativePathMetadata(
            `Post`,
            `1990-01-02-post-name/zh/index.md`,
        ),
    ).toEqual({
        name: `post-name`,
        documentIdentifier: `1990-01-02-post-name`,
        locale: `zh`,
        isIndex: true,
        createdTime: new Date(`1990-01-02`),
        slug: `zh/1990-01-02-post-name`,
    });
});

test('MDXDocumentRelativePathMetadata creates metadata for standalone Post relative path of valid date-time', () => {
    expect(
        MDXDocumentRelativePathMetadata(
            `Post`,
            `1990-01-02T04_03_02-post-name.md`,
        ),
    ).toEqual({
        name: `post-name`,
        documentIdentifier: `1990-01-02-post-name`,
        isIndex: false,
        createdTime: new Date(`1990-01-02T04:03:02`),
        slug: `1990-01-02-post-name`,
    });
});

test('MDXDocumentRelativePathMetadata creates metadata for wrapped Post relative path of valid date-time', () => {
    expect(
        MDXDocumentRelativePathMetadata(
            `Post`,
            `1990-01-02T04_03_02-post-name/index.md`,
        ),
    ).toEqual({
        name: `post-name`,
        documentIdentifier: `1990-01-02-post-name`,
        isIndex: true,
        createdTime: new Date(`1990-01-02T04:03:02`),
        slug: `1990-01-02-post-name`,
    });
});

test('MDXDocumentRelativePathMetadata creates metadata for wrapped Post relative path of valid timezone offset of hour and minute', () => {
    expect(
        MDXDocumentRelativePathMetadata(
            `Post`,
            `1990-01-02T04_03_02+08_00-post-name/index.md`,
        ),
    ).toEqual({
        name: `post-name`,
        documentIdentifier: `1990-01-02-post-name`,
        isIndex: true,
        createdTime: new Date(`1990-01-02T04:03:02+08:00`),
        slug: `1990-01-02-post-name`,
    });
});

test('MDXDocumentRelativePathMetadata creates metadata for wrapped Post relative path of valid timezone offset of four digits hour and minute', () => {
    expect(
        MDXDocumentRelativePathMetadata(
            `Post`,
            `1990-01-02T04_03_02+0800-post-name/index.md`,
        ),
    ).toEqual({
        name: `post-name`,
        documentIdentifier: `1990-01-02-post-name`,
        isIndex: true,
        createdTime: new Date(`1990-01-02T04:03:02+0800`),
        slug: `1990-01-02-post-name`,
    });
});

test('MDXDocumentRelativePathMetadata does not create metadata for standalone Post relative path of invalid year', () => {
    expect(
        MDXDocumentRelativePathMetadata(`Post`, `19-01-02-post-name.md`),
    ).toEqual({});
});

test('MDXDocumentRelativePathMetadata does not create metadata for standalone Post relative path of invalid month', () => {
    expect(
        MDXDocumentRelativePathMetadata(`Post`, `1990-1-02-post-name.md`),
    ).toEqual({});
});

test('MDXDocumentRelativePathMetadata does not create metadata for wrapped Post relative path of invalid day', () => {
    expect(
        MDXDocumentRelativePathMetadata(`Post`, `1990-01-2-post-name/index.md`),
    ).toEqual({});
});

test('MDXDocumentRelativePathMetadata does not create metadata for wrapped Post relative path of invalid hour', () => {
    expect(
        MDXDocumentRelativePathMetadata(
            `Post`,
            `1990-01-02T4_33_22-post-name/index.md`,
        ),
    ).toEqual({});
});

test('MDXDocumentRelativePathMetadata does not create metadata for wrapped Post relative path of invalid minute', () => {
    expect(
        MDXDocumentRelativePathMetadata(
            `Post`,
            `1990-01-02T04_3_22-post-name/index.md`,
        ),
    ).toEqual({});
});

test('MDXDocumentRelativePathMetadata does not create metadata for wrapped Post relative path of invalid second', () => {
    expect(
        MDXDocumentRelativePathMetadata(
            `Post`,
            `1990-01-02T04_03_2-post-name/index.md`,
        ),
    ).toEqual({});
});

test('MDXDocumentRelativePathMetadata does not create metadata for wrapped Post relative path of invalid hour offset of hour-minute timezone', () => {
    expect(
        MDXDocumentRelativePathMetadata(
            `Post`,
            `1990-01-02T04_03_0+4_00-post-name/index.md`,
        ),
    ).toEqual({});
});

test('MDXDocumentRelativePathMetadata does not create metadata for wrapped Post relative path of invalid minute offset of hour-minute timezone', () => {
    expect(
        MDXDocumentRelativePathMetadata(
            `Post`,
            `1990-01-02T04_03_0+04_0-post-name/index.md`,
        ),
    ).toEqual({});
});

test('MDXDocumentRelativePathMetadata does not create metadata for wrapped Post relative path of invalid hour timezone offset', () => {
    expect(
        MDXDocumentRelativePathMetadata(
            `Post`,
            `1990-01-02T04_03_0+08-post-name/index.md`,
        ),
    ).toEqual({});
});

test('MDXDocumentRelativePathMetadata does not create metadata for wrapped Post relative path of invalid hour timezone offset', () => {
    expect(
        MDXDocumentRelativePathMetadata(
            `Post`,
            `1990-01-02+4-post-name/index.md`,
        ),
    ).toEqual({});
});

test('MDXDocumentRelativePathMetadata does not create metadata for wrapped Post relative path of invalid one digit timezone offset', () => {
    expect(
        MDXDocumentRelativePathMetadata(
            `Post`,
            `1990-01-02+4-post-name/index.md`,
        ),
    ).toEqual({});
});

test('MDXDocumentRelativePathMetadata does not create metadata for wrapped Post relative path of invalid three digits timezone offset', () => {
    expect(
        MDXDocumentRelativePathMetadata(
            `Post`,
            `1990-01-02+444-post-name/index.md`,
        ),
    ).toEqual({});
});

test('MDXDocumentRelativePathMetadata does not create metadata for wrapped Post relative path of valid date and timezone offset', () => {
    expect(
        MDXDocumentRelativePathMetadata(
            `Post`,
            `1990-01-02+0800-post-name/index.md`,
        ),
    ).toEqual({});
});

test('MDXDocumentRelativePathMetadata does not create metadata for wrapped Post relative path of valid date and timezone offset', () => {
    expect(
        MDXDocumentRelativePathMetadata(
            `Post`,
            `1990-01-02+08_00-post-name/index.md`,
        ),
    ).toEqual({});
});

test('MDXDocumentRelativePathMetadata does not create metadata for wrapped Post relative path of valid date and timezone offset', () => {
    expect(
        MDXDocumentRelativePathMetadata(
            `Post`,
            `1990-01-02+08-post-name/index.md`,
        ),
    ).toEqual({});
});
