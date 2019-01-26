module.exports = async (post, graphql) => {
    const tags = post.node.tags.map((tagId) => {
        const tagNode = getNode(tagId);
        return {
            name: tagNode.name,
            slug: tagNode.slug,
        }
    });
    const category = getNode(post.node.category);

    const mdxDocument = _getMdxDocumentById(post.node.parent.id);

    return {
        title: post.node.title,
        subtitle: post.node.subtitle,
        isPublished: post.node.isPublished,
        createdTime: post.node.createdTime,
        lastModifiedTime: post.node.lastModifiedTime,
        tags: tags,
        category: category,
        slug: post.node.slug,
        tableOfContent: mdxDocument.node.toc,
        content: mdxDocument.node.html,
        keywords: post.node.keywords,
        description: post.node.description,
    }
};

const _getMdxDocumentById = async (id, graphql) => {
    const { data: { allPost } } = await graphql(`
        {
            allMdx(filter: {id: {eq: "${id}"}}) {
                edges {
                    node {
                        title
                        createdTime
                        tags
                        category
                        slug
                        isPublished
                        parent {
                            id
                        }
                    }
                }
            }
        }
    `);

    const { edges: posts } = allPost || { edges: [] };

    if (posts.length === 1) {
        return posts[0];
    } else if (posts.length === 0) {
        throw `No post found`;
    }
};
