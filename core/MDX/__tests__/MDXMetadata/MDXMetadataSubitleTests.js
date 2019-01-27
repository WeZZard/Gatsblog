const MDXMetadata = require('../../MDXMetadata');

// MARK: Post

test('MDXMetadata creates metadata of Post whose subtitle can fallback to its first #1 heading in rawBody', () => {
    const parentNode = {
        internal: {
            type: 'File',
        },
        sourceInstanceName: 'Post',
        relativePath: '2019-01-01-Post-Title.md',
        birthTime: '2019-01-01',
    };

    const node = {
        internal: {
            type: 'Mdx',
        },
        frontmatter: {
            title: 'Post Title',
            isPublished: true,
            tags: ['Tag1', 'Tag2', 'Tag3'],
            category: 'Category1',
            lastModifiedTime: '2019-01-02',
        },
        parent: {
            id: 'parentNode',
        },
        rawBody: '# Title\n# Subtitle',
    };

    const args = {
        node: node,
        getNode: (node) => {
            return node.id === 'parentNode' ? parentNode : null;
        },
    };

    const result = {
        documentType: 'Post',
        documentIdentifier: '2019-01-01-post-title',
        title: 'Post Title',
        subtitle: 'Subtitle',
        isIndex: false,
        isPublished: true,
        createdTime: new Date('2019-01-01'),
        lastModifiedTime: new Date('2019-01-02'),
        tags: ['Tag1', 'Tag2', 'Tag3'],
        category: 'Category1',
        locale: undefined,
        slug: 'post/2019-01-01-post-title',
    };

    expect(MDXMetadata(args)).toEqual(result);
});

// MARK: Page

test('MDXMetadata creates metadata of Page whose subtitle can fallback to its first #1 heading in rawBody', () => {
    const parentNode = {
        internal: {
            type: 'File',
        },
        sourceInstanceName: 'Page',
        relativePath: 'Page-Title.md',
        birthTime: '2019-01-01',
    };

    const node = {
        internal: {
            type: 'Mdx',
        },
        frontmatter: {
            title: 'Page Title',
            isPublished: true,
            tags: ['Tag1', 'Tag2', 'Tag3'],
            category: 'Category1',
            lastModifiedTime: '2019-01-02',
        },
        parent: {
            id: 'parentNode',
        },
        rawBody: '# Title\n# Subtitle',
    };

    const args = {
        node: node,
        getNode: (node) => {
            return node.id === 'parentNode' ? parentNode : null;
        },
    };

    const result = {
        documentType: 'Page',
        documentIdentifier: 'page-title',
        title: 'Page Title',
        subtitle: 'Subtitle',
        isIndex: false,
        isPublished: true,
        createdTime: new Date('2019-01-01'),
        lastModifiedTime: new Date('2019-01-02'),
        tags: ['Tag1', 'Tag2', 'Tag3'],
        category: 'Category1',
        locale: undefined,
        slug: 'page-title',
    };

    expect(MDXMetadata(args)).toEqual(result);
});
