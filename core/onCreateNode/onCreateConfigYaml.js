

const onCreateConfigYaml = (arg) => {
    const {
        node,
        actions,
        getNode,
        getNodesByType,
        createNodeId,
        createContentDigest,
    } = arg;

    const { createNode, createParentChildLink } = actions;

    if (node.internal.type === 'ConfigYaml') {

    }
};

module.exports = onCreateConfigYaml;
