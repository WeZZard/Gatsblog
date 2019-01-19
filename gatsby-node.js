const createPages = require(`./utils/_pageCreators`);
const onCreateNode = require(`./utils/_nodeDecorators`);

exports.onCreateNode = ({ node, actions, getNode, getNodesByType, createNodeId, createContentDigest}) => {
    const { createNodeField, createNode } = actions;
    onCreateNode(node, getNode, getNodesByType, createNode, createNodeField, createNodeId, createContentDigest);
};

exports.createPages = ({ graphql, actions }) => {
    createPages(graphql, actions);
};
