const _ = require("lodash");
const debug = require('debug');

module.exports = function(args) {
    const {
        tag,
        getNodesByType,
        createNode,
        createNodeId,
        createContentDigest
    } = args;

    const kebabTag = _.kebabCase(tag);
    const tagData = {name: tag, slug: `tags/${kebabTag}`};
    const existedNodes = getNodesByType(`Tag`).filter(node => node.slug === tagData.slug);
    if (existedNodes.length === 1) {
        const node = existedNodes[0];
        if (node.name !== tagData.name) {
            throw `Tag "${node.name}" and "${tagData.name}" shares the same slug: ${node.slug}, which is not allowed.`;
        }
        debug(`Returns the existed tag node: ${node}`);
        return node.id;
    } else if (existedNodes.length === 0) {
        const nodeId = createNodeId(`tag-${kebabTag}`);
        const nodeData = Object.assign({}, tagData, {
            id: nodeId,
            parent: null,
            children: [],
            internal: {
                type: `Tag`,
                content: tag,
                contentDigest: createContentDigest(tagData.slug),
            },
        });
        debug(`Create tag node: ${tag}`);
        createNode(nodeData);
        return nodeId;
    } else {
        throw `Multiple tag nodes was found. ${existedNodes}`;
    }
};
