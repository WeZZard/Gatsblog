const { _parseMetadataForMarkdownNode } = require('./_parsers');
const assert = require('assert');
const _ = require("lodash");

const _decorateMarkdownRemarkDocuments = (node, getNode, getNodesByType, createNode, createNodeField, createNodeId, createContentDigest) => {
    if (node.internal.type === 'MarkdownRemark') {
        console.log(`Decorating markdown document at: ${getNode(node.parent).relativePath}.`);
        
        let metadata = _parseMetadataForMarkdownNode(node, getNode);

        assert(metadata.documentType !== undefined);
        assert(metadata.title !== undefined);
        assert(metadata.subtitle !== undefined);
        assert(metadata.slug !== undefined);
        assert(metadata.birthTime !== undefined);
        assert(metadata.tags !== undefined);
        assert(metadata.category !== undefined);

        createNodeField({node, name: 'documentType', value: metadata.documentType});
        createNodeField({node, name: 'title',  value: metadata.title});
        createNodeField({node, name: 'subtitle',  value: metadata.subtitle});
        createNodeField({node, name: 'slug', value: metadata.slug});
        createNodeField({node, name: 'birthTime', value: metadata.birthTime});
        createNodeField({node, name: 'tags',  value: metadata.tags});
        createNodeField({node, name: 'category',  value: metadata.category});

        metadata.tags.map(tag => {
            const kebabTag = _.kebabCase(tag);
            const primitiveTag = {name: tag, slug: `tags/${kebabTag}`};
            const existedNodes = getNodesByType(`Tag`).filter(node => node.slug === primitiveTag.slug);
            if (existedNodes.length === 1) {
                const node = existedNodes[0];
                if (node.name !== primitiveTag.name) {
                    throw `Tag "${node.name}" and "${primitiveTag.name}" shares the same slug: ${node.slug}, which is not allowed.`;
                }
                return node;
            } else if (existedNodes.length === 0) {
                const nodeId = createNodeId(`tag-${kebabTag}`);
                const nodeData = Object.assign({}, primitiveTag, {
                    id: nodeId,
                    parent: null,
                    children: [],
                    internal: {
                        type: `Tag`,
                        content: tag,
                        contentDigest: createContentDigest(primitiveTag),
                    },
                });
                console.log(`Create tag node: ${tag}`);
                return createNode(nodeData)
            } else {
                throw `Multiple tag nodes was found. ${existedNodes}`;
            }
        });

        const makeCategoryNode = (category) => {
            const kebabCategory = _.kebabCase(category);
            const primitiveCategory = {name: category, slug: `${kebabCategory}`};
            const existedNodes = getNodesByType(`Category`).filter(node => node.slug === primitiveCategory.slug);
            if (existedNodes.length === 1) {
                const node = existedNodes[0];
                if (node.name !== primitiveCategory.name) {
                    throw `Category "${node.name}" and "${primitiveCategory.name}" shares the same slug: ${node.slug}, which is not allowed.`;
                }
                return node;
            } else if (existedNodes.length === 0) {
                assert(metadata.category !== "");
                const nodeId = createNodeId(`category-${kebabCategory}`);
                const nodeData = Object.assign({}, primitiveCategory, {
                    id: nodeId,
                    parent: null,
                    children: [],
                    internal: {
                        type: `Category`,
                        content: category,
                        contentDigest: createContentDigest(primitiveCategory),
                    },
                });
                console.log(`Create category node: ${category}`);
                return createNode(nodeData)
            } else {
                throw `Multiple category nodes was found. ${existedNodes}`;
            }
        };

        makeCategoryNode(metadata.category);
    }
};

module.exports = function (node, getNode, getNodesByType, createNode, createNodeField, createNodeId, createContentDigest) {
    _decorateMarkdownRemarkDocuments(node, getNode, getNodesByType, createNode, createNodeField, createNodeId, createContentDigest)
};
