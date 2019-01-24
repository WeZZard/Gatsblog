const _ = require("lodash");
const debug = require('debug');
const assert = require('assert');

module.exports = function(args) {
    const {
        category,
        getNodesByType,
        createNode,
        createNodeId,
        createContentDigest
    } = args;

    const kebabCategory = _.kebabCase(category);
    const categoryData = {name: category, slug: `${kebabCategory}`};
    const existedNodes = getNodesByType(`Category`).filter(node => node.slug === categoryData.slug);
    if (existedNodes.length === 1) {
        const node = existedNodes[0];
        if (node.name !== categoryData.name) {
            throw `Category "${node.name}" and "${categoryData.name}" shares the same slug: ${node.slug}, which is not allowed.`;
        }
        debug(`Returns the existed category node: ${node}`);
        return node.id;
    } else if (existedNodes.length === 0) {
        assert(category !== "");
        const nodeId = createNodeId(`category-${kebabCategory}`);
        const nodeData = Object.assign({}, categoryData, {
            id: nodeId,
            parent: null,
            children: [],
            internal: {
                type: `Category`,
                content: category,
                contentDigest: createContentDigest(categoryData.slug),
            },
        });
        debug(`Create category node: ${category}`);
        createNode(nodeData);
        return nodeId;
    } else {
        throw `Multiple category nodes was found. ${existedNodes}`;
    }
};
