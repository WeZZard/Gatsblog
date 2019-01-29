const _ = require("lodash");
const debug = require('debug');

module.exports = function(args) {
    const {
        category,
        getNodesByType,
        createNode,
        createNodeId,
        createContentDigest
    } = args;

    const kebabCategory = _.kebabCase(category);
    const categoryData = {name: category, slug: `category/${kebabCategory}`};
    const existedNodes = getNodesByType(`Category`).filter(node => node.slug === categoryData.slug);
    if (existedNodes.length === 1) {
        const node = existedNodes[0];
        if (node.name !== categoryData.name) {
            throw `Category "${node.name}" and "${categoryData.name}" shares the same slug: ${node.slug}, which is not allowed.`;
        }
        debug(`Returns the data of existed category node: ${node}`);
        return categoryData;
    } else if (existedNodes.length === 0) {
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
        return categoryData;
    } else {
        throw `Multiple category nodes was found. ${existedNodes}`;
    }
};
