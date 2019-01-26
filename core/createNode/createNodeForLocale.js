const _ = require("lodash");
const debug = require('debug');
const assert = require('assert');

module.exports = function(args) {
    const {
        locale,
        getNodesByType,
        createNode,
        createNodeId,
        createContentDigest
    } = args;

    const pattern = /^\w+$/;

    if (!pattern.exec(locale)) {
        throws `Invalid locale: "${locale}".`
    }

    const localeData = {
        identifier: locale,
        slug: locale === 'none' ? '' : `${locale}`
    };
    const existedNodes = getNodesByType(`Locale`).filter(node => node.identifier === localeData.identifier);
    if (existedNodes.length === 1) {
        const node = existedNodes[0];
        if (node.identifier !== localeData.identifier) {
            throw `Duplicate locale "${node.identifier}".`;
        }
        debug(`Returns the data of existed locale node: ${node}`);
        return localeData;
    } else if (existedNodes.length === 0) {
        const nodeId = createNodeId(`locale-${locale}`);
        const nodeData = Object.assign({}, localeData, {
            id: nodeId,
            parent: null,
            children: [],
            internal: {
                type: `Locale`,
                content: locale,
                contentDigest: createContentDigest(localeData.identifier),
            },
        });
        debug(`Create locale node: ${locale}`);
        createNode(nodeData);
        return localeData;
    } else {
        throw `Multiple locale nodes was found. ${existedNodes}`;
    }
};
