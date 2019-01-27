const MDXRelativePathMetadata = require('../../MDXRelativePathMetadata');

test('MDXRelativePathMetadata creates metadata for standalone Post relative path of valid date', () => {
    expect(
        MDXRelativePathMetadata(`Post`, `1990-01-02-post-name.md`),
    ).toEqual({
        name: `post-name`,
        documentIdentifier: `1990-01-02-post-name`,
        isIndex: false,
        createdTime: new Date(`1990-01-02`),
        slug: `post/1990-01-02-post-name`,
    });
});

test('MDXRelativePathMetadata creates metadata for standalone Post relative path of valid date-time', () => {
    expect(
        MDXRelativePathMetadata(
            `Post`,
            `1990-01-02T04_03_02-post-name.md`,
        ),
    ).toEqual({
        name: `post-name`,
        documentIdentifier: `1990-01-02-post-name`,
        isIndex: false,
        createdTime: new Date(`1990-01-02T04:03:02`),
        slug: `post/1990-01-02-post-name`,
    });
});

test('MDXRelativePathMetadata does not create metadata for standalone Post relative path of invalid year', () => {
    expect(
        MDXRelativePathMetadata(`Post`, `19-01-02-post-name.md`),
    ).toEqual({});
});

test('MDXRelativePathMetadata does not create metadata for standalone Post relative path of invalid month', () => {
    expect(
        MDXRelativePathMetadata(`Post`, `1990-1-02-post-name.md`),
    ).toEqual({});
});

test('MDXRelativePathMetadata creates metadata for language localized wrapped Post relative path of valid date', () => {
    expect(
        MDXRelativePathMetadata(
            `Post`,
            `1990-01-02-post-name/zh/index.md`,
        ),
    ).toEqual({
        name: `post-name`,
        documentIdentifier: `1990-01-02-post-name`,
        locale: `zh`,
        isIndex: true,
        createdTime: new Date(`1990-01-02`),
        slug: `zh/post/1990-01-02-post-name`,
    });
});

test('MDXRelativePathMetadata creates metadata for language and script localized wrapped Post relative path of valid date', () => {
    expect(
        MDXRelativePathMetadata(
            `Post`,
            `1990-01-02-post-name/zh-Hant/index.md`,
        ),
    ).toEqual({
        name: `post-name`,
        documentIdentifier: `1990-01-02-post-name`,
        locale: `zh-Hant`,
        isIndex: true,
        createdTime: new Date(`1990-01-02`),
        slug: `zh-hant/post/1990-01-02-post-name`,
    });
});

test('MDXRelativePathMetadata creates metadata for wrapped Post relative path of valid date', () => {
    expect(
        MDXRelativePathMetadata(
            `Post`,
            `1990-01-02-post-name/index.md`,
        ),
    ).toEqual({
        name: `post-name`,
        documentIdentifier: `1990-01-02-post-name`,
        isIndex: true,
        createdTime: new Date(`1990-01-02`),
        slug: `post/1990-01-02-post-name`,
    });
});

test('MDXRelativePathMetadata creates metadata for wrapped Post relative path of valid date-time', () => {
    expect(
        MDXRelativePathMetadata(
            `Post`,
            `1990-01-02T04_03_02-post-name/index.md`,
        ),
    ).toEqual({
        name: `post-name`,
        documentIdentifier: `1990-01-02-post-name`,
        isIndex: true,
        createdTime: new Date(`1990-01-02T04:03:02`),
        slug: `post/1990-01-02-post-name`,
    });
});

test('MDXRelativePathMetadata creates metadata for wrapped Post relative path of valid timezone offset of hour and minute', () => {
    expect(
        MDXRelativePathMetadata(
            `Post`,
            `1990-01-02T04_03_02+08_00-post-name/index.md`,
        ),
    ).toEqual({
        name: `post-name`,
        documentIdentifier: `1990-01-02-post-name`,
        isIndex: true,
        createdTime: new Date(`1990-01-02T04:03:02+08:00`),
        slug: `post/1990-01-02-post-name`,
    });
});

test('MDXRelativePathMetadata creates metadata for wrapped Post relative path of valid timezone offset of four digits hour and minute', () => {
    expect(
        MDXRelativePathMetadata(
            `Post`,
            `1990-01-02T04_03_02+0800-post-name/index.md`,
        ),
    ).toEqual({
        name: `post-name`,
        documentIdentifier: `1990-01-02-post-name`,
        isIndex: true,
        createdTime: new Date(`1990-01-02T04:03:02+0800`),
        slug: `post/1990-01-02-post-name`,
    });
});

test('MDXRelativePathMetadata does not create metadata for wrapped Post relative path of invalid day', () => {
    expect(
        MDXRelativePathMetadata(`Post`, `1990-01-2-post-name/index.md`),
    ).toEqual({});
});

test('MDXRelativePathMetadata does not create metadata for wrapped Post relative path of invalid hour', () => {
    expect(
        MDXRelativePathMetadata(
            `Post`,
            `1990-01-02T4_33_22-post-name/index.md`,
        ),
    ).toEqual({});
});

test('MDXRelativePathMetadata does not create metadata for wrapped Post relative path of invalid minute', () => {
    expect(
        MDXRelativePathMetadata(
            `Post`,
            `1990-01-02T04_3_22-post-name/index.md`,
        ),
    ).toEqual({});
});

test('MDXRelativePathMetadata does not create metadata for wrapped Post relative path of invalid second', () => {
    expect(
        MDXRelativePathMetadata(
            `Post`,
            `1990-01-02T04_03_2-post-name/index.md`,
        ),
    ).toEqual({});
});

test('MDXRelativePathMetadata does not create metadata for wrapped Post relative path of invalid hour offset of hour-minute timezone', () => {
    expect(
        MDXRelativePathMetadata(
            `Post`,
            `1990-01-02T04_03_0+4_00-post-name/index.md`,
        ),
    ).toEqual({});
});

test('MDXRelativePathMetadata does not create metadata for wrapped Post relative path of invalid minute offset of hour-minute timezone', () => {
    expect(
        MDXRelativePathMetadata(
            `Post`,
            `1990-01-02T04_03_0+04_0-post-name/index.md`,
        ),
    ).toEqual({});
});

test('MDXRelativePathMetadata does not create metadata for wrapped Post relative path of invalid hour timezone offset', () => {
    expect(
        MDXRelativePathMetadata(
            `Post`,
            `1990-01-02T04_03_0+08-post-name/index.md`,
        ),
    ).toEqual({});
});

test('MDXRelativePathMetadata does not create metadata for wrapped Post relative path of invalid hour timezone offset', () => {
    expect(
        MDXRelativePathMetadata(
            `Post`,
            `1990-01-02+4-post-name/index.md`,
        ),
    ).toEqual({});
});

test('MDXRelativePathMetadata does not create metadata for wrapped Post relative path of invalid one digit timezone offset', () => {
    expect(
        MDXRelativePathMetadata(
            `Post`,
            `1990-01-02+4-post-name/index.md`,
        ),
    ).toEqual({});
});

test('MDXRelativePathMetadata does not create metadata for wrapped Post relative path of invalid three digits timezone offset', () => {
    expect(
        MDXRelativePathMetadata(
            `Post`,
            `1990-01-02+444-post-name/index.md`,
        ),
    ).toEqual({});
});

test('MDXRelativePathMetadata does not create metadata for wrapped Post relative path of valid date and timezone offset', () => {
    expect(
        MDXRelativePathMetadata(
            `Post`,
            `1990-01-02+0800-post-name/index.md`,
        ),
    ).toEqual({});
});

test('MDXRelativePathMetadata does not create metadata for wrapped Post relative path of valid date and timezone offset', () => {
    expect(
        MDXRelativePathMetadata(
            `Post`,
            `1990-01-02+08_00-post-name/index.md`,
        ),
    ).toEqual({});
});

test('MDXRelativePathMetadata does not create metadata for wrapped Post relative path of valid date and timezone offset', () => {
    expect(
        MDXRelativePathMetadata(
            `Post`,
            `1990-01-02+08-post-name/index.md`,
        ),
    ).toEqual({});
});
