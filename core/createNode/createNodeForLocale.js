const _ = require("lodash");
const debug = require('debug');
const assert = require('assert');

module.exports = function(args) {
    const {
        localeIdentifier = 'none',
        getNodesByType,
        createNode,
        createNodeId,
        createContentDigest
    } = args;

    const pattern = /^\w+$/;

    if (!pattern.exec(localeIdentifier)) {
        throws `Invalid locale: "${localeIdentifier}".`
    }

    const localeData = {
        identifier: localeIdentifier,
        slug: localeIdentifier === 'none' ? '' : localeIdentifier
    };
    const existedNodes = getNodesByType(`Locale`).filter(node => node.identifier === localeData.identifier);
    if (existedNodes.length === 1) {
        const node = existedNodes[0];
        if (node.identifier !== localeData.identifier) {
            throw `Duplicate locale "${node.identifier}".`;
        }
        debug(`Returns the existed locale node: ${node}`);
        return node.id;
    } else if (existedNodes.length === 0) {
        const nodeId = createNodeId(`locale-${localeIdentifier}`);
        const nodeData = Object.assign({}, localeData, {
            id: nodeId,
            parent: null,
            children: [],
            internal: {
                type: `Locale`,
                content: localeIdentifier,
                contentDigest: createContentDigest(localeData.identifier),
            },
        });
        debug(`Create locale node: ${localeIdentifier}`);
        createNode(nodeData);
        return nodeId;
    } else {
        throw `Multiple locale nodes was found. ${existedNodes}`;
    }
};
