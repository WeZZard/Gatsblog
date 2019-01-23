const MDXMetadata = require('../MDX/MDXMetadata');
const createNodeOfPost = require('../createNode/createNodeOfPost');
const createNodeOfPage = require('../createNode/createNodeOfPage');
const createNodeOfTag = require('../createNode/createNodeOfTag');
const createNodeOfCategory = require('../createNode/createNodeOfCategory');
const debug = require('debug');

const onCreateMDXDocuments = (arg) => {
    const {
        node,
        actions,
        getNodesByType,
        createNodeId,
        createContentDigest
    } = arg;

    const { createNode } = actions;

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
            return createNodeOfTag(tagArgs);
        });

        const categoryArgs = {
            category: metadata.category,
            getNodesByType: getNodesByType,
            createNode: createNode,
            createNodeId: createNodeId,
            createContentDigest: createContentDigest,
        };

        const category = createNodeOfCategory(categoryArgs);

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
                    createNode: createNode,
                    createNodeId: createNodeId,
                    createContentDigest: createContentDigest,
                };
                createNodeOfPost(postArgs);
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
                    createNode: createNode,
                    createNodeId: createNodeId,
                    createContentDigest: createContentDigest,
                };
                createNodeOfPage(pageArgs);
                break;
            default:
                debug(`Unexpected document type: ${metadata.documentType}.`);
        }
    }
};

module.exports = onCreateMDXDocuments;
