const MDXMetadata = require('../MDX/MDXMetadata');
const createNodeForPost = require('../createNode/createNodeForPost');
const createNodeForPage = require('../createNode/createNodeForPage');
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
        const metadata = new MDXMetadata(args);

        const documentNodeCreator = getDocumentNodeCreator(metadata.documentType);

        const documentArgs = {
            parent: node.id,
            document: {
                title: metadata.title,
                subtitle: metadata.subtitle,
                documentIdentifier: metadata.documentIdentifier,
                isPublished: metadata.isPublished,
                createdTime: metadata.createdTime,
                lastModifiedTime: metadata.lastModifiedTime,
                tags: metadata.tags,
                category: metadata.category,
                slug: metadata.slug,
                locale: metadata.locale || 'none',
            },
            getNode: getNode,
            createNode: createNode,
            createNodeId: createNodeId,
            createContentDigest: createContentDigest,
            createParentChildLink: createParentChildLink,
        };

        documentNodeCreator(documentArgs);
    }
};

const getDocumentNodeCreator = (documentType) => {
    switch (documentType) {
        case 'Post':
            return createNodeForPost;
        case 'Page':
            return createNodeForPage;
        default:
            debug(`Unexpected document type: ${metadata.documentType}.`);
            return undefined;
    }
};
