const MDXMetadata = require('../MDX/MDXMetadata');
const {
    createNodeForPost,
    createNodeForPage,
} = require('../createNode');
const debug = require('debug');

module.exports = (args) => {
    const {
        node,
        actions,
        getNode,
        createNodeId,
        createContentDigest,
    } = args;

    const { createNode, createParentChildLink } = actions;

    if (node.internal.type === 'Mdx') {
        const isPreviewEnabled = process.env.GATSBY_IS_PREVIEW_ENABLED || false;

        const metadata = new MDXMetadata(args);

        if (isPreviewEnabled || metadata.isPublished) {
            switch (metadata.documentType) {
                case 'Post':
                    const postArgs = {
                        parent: node.id,
                        post: {
                            title: metadata.title,
                            subtitle: metadata.subtitle,
                            documentIdentifier: metadata.documentIdentifier,
                            isPublished: metadata.isPublished,
                            createdTime: metadata.createdTime,
                            lastModifiedTime: metadata.lastModifiedTime,
                            tags: metadata.tags,
                            category: metadata.category,
                            slug: metadata.slug,
                            lang: metadata.lang,
                            isLocalized: metadata.isLocalized,
                            license: metadata.license,
                        },
                        relativePath: metadata.relativePath,
                        getNode,
                        createNode,
                        createNodeId,
                        createContentDigest,
                        createParentChildLink,
                    };
                    createNodeForPost(postArgs);
                    break;
                case 'Page':
                    const pageArgs = {
                        parent: node.id,
                        page: {
                            title: metadata.title,
                            subtitle: metadata.subtitle,
                            documentIdentifier: metadata.documentIdentifier,
                            isPublished: metadata.isPublished,
                            createdTime: metadata.createdTime,
                            lastModifiedTime: metadata.lastModifiedTime,
                            slug: metadata.slug,
                            lang: metadata.lang,
                            isLocalized: metadata.isLocalized,
                            license: metadata.license,
                        },
                        relativePath: metadata.relativePath,
                        getNode,
                        createNode,
                        createNodeId,
                        createContentDigest,
                        createParentChildLink,
                    };
                    createNodeForPage(pageArgs);
                    break;
                default:
                    debug(`Unexpected document type: ${metadata.documentType}.`);
            }
        }
    }
};
