const MDXMetadata = require('../../MDXMetadata');

test('MDXMetadata creates metadata whose lastModified can fallback to createdTime', () => {
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
        createdTime: new Date('2019-01-01'),
        lastModifiedTime: new Date('2019-01-01'),
        tags: ['Tag1', 'Tag2', 'Tag3'],
        category: 'Category1',
        locale: undefined,
        slug: 'post/2019-01-01-post-title',
    };

    expect(MDXMetadata(args)).toEqual(result);
});
