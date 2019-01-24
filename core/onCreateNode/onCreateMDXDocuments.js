const MDXMetadata = require('../MDX/MDXMetadata');
const createNodeForPost = require('../createNode/createNodeForPost');
const createNodeForPage = require('../createNode/createNodeForPage');
const createNodeForTag = require('../createNode/createNodeForTag');
const createNodeForCategory = require('../createNode/createNodeForCategory');
const debug = require('debug');

const onCreateMDXDocuments = (arg) => {
    const {
        node,
        actions,
        getNode,
        getNodesByType,
        createNodeId,
        createContentDigest,
    } = arg;

    const { createNode, createParentChildLink } = actions;

    if (node.internal.type === 'Mdx') {
        const metadata = new MDXMetadata(arg);

        const tags = metadata.tags.map(tag => {
            const tagArgs = {
                tag: tag,
                getNodesByType: getNodesByType,
                createNode: createNode,
                createNodeId: createNodeId,
                createContentDigest: createContentDigest,
            };
            return createNodeForTag(tagArgs);
        });

        const categoryArgs = {
            category: metadata.category,
            getNodesByType: getNodesByType,
            createNode: createNode,
            createNodeId: createNodeId,
            createContentDigest: createContentDigest,
        };

        const category = createNodeForCategory(categoryArgs);

        switch (metadata.documentType) {
            case 'Post':
                const postArgs = {
                    parent: node.id,
                    post: {
                        title: metadata.title,
                        isDraft: metadata.isDraft,
                        createdTime: metadata.createdTime,
                        lastModifiedTime: metadata.lastModifiedTime,
                        tags: tags,
                        category: category,
                        slug: metadata.slug,
                    },
                    getNode: getNode,
                    createNode: createNode,
                    createNodeId: createNodeId,
                    createContentDigest: createContentDigest,
                    createParentChildLink: createParentChildLink,
                };
                createNodeForPost(postArgs);
                break;
            case 'Page':
                const pageArgs = {
                    parent: node.id,
                    page: {
                        title: metadata.title,
                        isDraft: metadata.isDraft,
                        createdTime: metadata.createdTime,
                        lastModifiedTime: metadata.lastModifiedTime,
                        tags: tags,
                        category: category,
                        slug: metadata.slug,
                    },
                    getNode: getNode,
                    createNode: createNode,
                    createNodeId: createNodeId,
                    createContentDigest: createContentDigest,
                    createParentChildLink: createParentChildLink,
                };
                createNodeForPage(pageArgs);
                break;
            default:
                debug(`Unexpected document type: ${metadata.documentType}.`);
        }
    }
};

module.exports = onCreateMDXDocuments;
