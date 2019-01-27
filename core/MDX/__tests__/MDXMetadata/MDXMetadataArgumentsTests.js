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
