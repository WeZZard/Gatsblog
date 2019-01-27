const MDXMetadata = require('../../MDXMetadata');

test('MDXMetadata returns null when node.internal.type is not Mdx', () => {
    const args = {
        node: {
            internal: {
                type: 'File',
            },
        },
    };

    expect(MDXMetadata(args)).toBeNull();
});

// MARK: Post

test('MDXMetadata creates metadata of Post', () => {
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
            subtitle: 'Post Subtitle',
            isPublished: true,
            tags: ['Tag1', 'Tag2', 'Tag3'],
            category: 'Category1',
            date: '2019-01-02',
            lastModifiedTime: '2019-01-03',
        },
        parent: {
            id: 'parentNode',
        },
        rawBody: '',
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
        subtitle: 'Post Subtitle',
        isIndex: false,
        isPublished: true,
        createdTime: new Date('2019-01-02'),
        lastModifiedTime: new Date('2019-01-03'),
        tags: ['Tag1', 'Tag2', 'Tag3'],
        category: 'Category1',
        locale: undefined,
        slug: 'post/2019-01-01-post-title',
    };

    expect(MDXMetadata(args)).toEqual(result);
});

test('MDXMetadata creates metadata of localized Post', () => {
    const parentNode = {
        internal: {
            type: 'File',
        },
        sourceInstanceName: 'Post',
        relativePath: '2019-01-01-Post-Title/en-US/index.md',
        birthTime: '2019-01-01',
    };

    const node = {
        internal: {
            type: 'Mdx',
        },
        frontmatter: {
            title: 'Post Title',
            subtitle: 'Post Subtitle',
            isPublished: true,
            tags: ['Tag1', 'Tag2', 'Tag3'],
            category: 'Category1',
            lastModifiedTime: '2019-01-02',
        },
        parent: {
            id: 'parentNode',
        },
        rawBody: '',
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
        subtitle: 'Post Subtitle',
        isIndex: true,
        isPublished: true,
        createdTime: new Date('2019-01-01'),
        lastModifiedTime: new Date('2019-01-02'),
        tags: ['Tag1', 'Tag2', 'Tag3'],
        category: 'Category1',
        locale: 'en-US',
        slug: 'en-us/post/2019-01-01-post-title',
    };

    expect(MDXMetadata(args)).toEqual(result);
});

// MARK: Page

test('MDXMetadata creates metadata of Page', () => {
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
            subtitle: 'Page Subtitle',
            isPublished: true,
            tags: ['Tag1', 'Tag2', 'Tag3'],
            category: 'Category1',
            lastModifiedTime: '2019-01-02',
        },
        parent: {
            id: 'parentNode',
        },
        rawBody: '',
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
        subtitle: 'Page Subtitle',
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

test('MDXMetadata creates metadata of localized Page', () => {
    const parentNode = {
        internal: {
            type: 'File',
        },
        sourceInstanceName: 'Page',
        relativePath: 'Page-Title/en-US/index.md',
        birthTime: '2019-01-01',
    };

    const node = {
        internal: {
            type: 'Mdx',
        },
        frontmatter: {
            title: 'Page Title',
            subtitle: 'Page Subtitle',
            isPublished: true,
            tags: ['Tag1', 'Tag2', 'Tag3'],
            category: 'Category1',
            lastModifiedTime: '2019-01-02',
        },
        parent: {
            id: 'parentNode',
        },
        rawBody: '',
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
        subtitle: 'Page Subtitle',
        isIndex: true,
        isPublished: true,
        createdTime: new Date('2019-01-01'),
        lastModifiedTime: new Date('2019-01-02'),
        tags: ['Tag1', 'Tag2', 'Tag3'],
        category: 'Category1',
        locale: 'en-US',
        slug: 'en-us/page-title',
    };

    expect(MDXMetadata(args)).toEqual(result);
});
