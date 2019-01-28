const debug = require('debug');

module.exports = function (args) {
    const {
        parent,
        post,
        getNode,
        createNode,
        createNodeId,
        createContentDigest,
        createParentChildLink
    } = args;

    const nodeId = createNodeId(`post-${post.slug}`);
    const nodeData = Object.assign({}, post, {
        id: nodeId,
        parent: parent,
        children: [],
        internal: {
            type: `Post`,
            content: post.relativePath,
            contentDigest: createContentDigest(post.relativePath),
        },
    });

    debug(`Create post node: ${post}`);
    createNode(nodeData);

    createParentChildLink({parent: getNode(parent), child: getNode(nodeId)});

    return post;
};
