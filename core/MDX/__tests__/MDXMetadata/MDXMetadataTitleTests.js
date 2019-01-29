const MDXMetadata = require('../../MDXMetadata');
const { makeDisambiguateIdentifier: _ } = require('../../MDXShims');

// MARK: Post

test('MDXMetadata creates metadata of Post whose title can fallback to its first #1 heading in rawBody', () => {
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
            subtitle: 'Post Subtitle',
            isPublished: true,
            tags: ['Tag1', 'Tag2', 'Tag3'],
            category: 'Category1',
            lastModifiedTime: '2019-01-02',
        },
        parent: {
            id: 'parentNode',
        },
        rawBody: '# Title',
    };

    const args = {
        node: node,
        getNode: (node) => {
            return node.id === 'parentNode' ? parentNode : null;
        },
    };

    const result = {
        documentType: 'Post',
        documentIdentifier: '2019-01-01-Post-Title',
        title: 'Title',
        subtitle: 'Post Subtitle',
        isIndex: false,
        isPublished: true,
        createdTime: new Date('2019-01-01'),
        lastModifiedTime: new Date('2019-01-02'),
        tags: ['Tag1', 'Tag2', 'Tag3'],
        category: 'Category1',
        lang: undefined,
        isLocalized: false,
        slug: `/post/2019/01/post-title-${_('2019-01-01-Post-Title')}`,
        relativePath: '2019-01-01-Post-Title.md',
    };

    expect(MDXMetadata(args)).toEqual(result);
});

test('MDXMetadata creates metadata of Post whose title can fallback to its document name', () => {
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
        documentIdentifier: '2019-01-01-Post-Title',
        title: 'Post-Title',
        subtitle: 'Post Subtitle',
        isIndex: false,
        isPublished: true,
        createdTime: new Date('2019-01-01'),
        lastModifiedTime: new Date('2019-01-02'),
        tags: ['Tag1', 'Tag2', 'Tag3'],
        category: 'Category1',
        lang: undefined,
        isLocalized: false,
        slug: `/post/2019/01/post-title-${_('2019-01-01-Post-Title')}`,
        relativePath: '2019-01-01-Post-Title.md',
    };

    expect(MDXMetadata(args)).toEqual(result);
});

// MARK: Page

test('MDXMetadata creates metadata of Page whose title can fallback to its first #1 heading in rawBody', () => {
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
            subtitle: 'Page Subtitle',
            isPublished: true,
            lastModifiedTime: '2019-01-02',
        },
        parent: {
            id: 'parentNode',
        },
        rawBody: '# Title',
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
        title: 'Title',
        subtitle: 'Page Subtitle',
        isIndex: false,
        isPublished: true,
        createdTime: new Date('2019-01-01'),
        lastModifiedTime: new Date('2019-01-02'),
        lang: undefined,
        isLocalized: false,
        slug: '/page-title',
        relativePath: 'Page-Title.md',
    };

    expect(MDXMetadata(args)).toEqual(result);
});

test('MDXMetadata creates metadata of Page whose title can fallback to its document name', () => {
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
            subtitle: 'Page Subtitle',
            isPublished: true,
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
        title: 'Page-Title',
        subtitle: 'Page Subtitle',
        isIndex: false,
        isPublished: true,
        createdTime: new Date('2019-01-01'),
        lastModifiedTime: new Date('2019-01-02'),
        lang: undefined,
        isLocalized: false,
        slug: '/page-title',
        relativePath: 'Page-Title.md',
    };
    expect(MDXMetadata(args)).toEqual(result);
});
