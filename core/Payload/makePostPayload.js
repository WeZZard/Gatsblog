module.exports = async (args) => {
    const { post, tags, categories, graphql } = args;

    const postTags = filterTagsForPostNode(post, tags);
    const postCategory = filterCategoryForPostNode(post, categories);

    const mdxDocument = _getMdxDocumentById({
        id: post.node.parent.id,
        graphql
    });

    return {
        title: post.node.title,
        subtitle: post.node.subtitle,
        isPublished: post.node.isPublished,
        createdTime: post.node.createdTime,
        lastModifiedTime: post.node.lastModifiedTime,
        tags: postTags,
        category: postCategory,
        slug: post.node.slug,
        tableOfContent: mdxDocument.node.toc,
        content: mdxDocument.node.html,
        core: mdxDocument.node.code,
        keywords: post.node.keywords,
        description: post.node.description,
    }
};
