const MDXMetadata = require('../../MDXMetadata');
const { makeDisambiguateIdentifier: _ } = require('../../MDXShims');

test('MDXMetadata creates metadata whose isLocalized can fallback to false', () => {
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
        title: 'Post Title',
        subtitle: 'Post Subtitle',
        isIndex: false,
        isPublished: true,
        createdTime: new Date('2019-01-01'),
        lastModifiedTime: new Date('2019-01-02'),
        tags: [],
        category: 'Category1',
        lang: undefined,
        isLocalized: false,
        slug: `post/2019/01/post-title-${_('2019-01-01-Post-Title')}`,
        relativePath: '2019-01-01-Post-Title.md',
    };

    expect(MDXMetadata(args)).toEqual(result);
});
