const debug = require('debug');

module.exports = function(args) {
  const {
    config,
    parent,
    getNode,
    getNodesByType,
    createNode,
    createNodeId,
    createContentDigest,
    createParentChildLink,
  } = args;

  const existedNodes = getNodesByType(`Config`).filter(
    node => node.relativePath === config.relativePath,
  );

  if (existedNodes.length === 1) {
    const node = existedNodes[0];
    if (node.relativePath !== config.relativePath) {
      throw `Duplicate config for "${node.relativePath}".`;
    }
    debug(`Returns the data of existed config node: ${node}`);

    return config;
  } else if (existedNodes.length === 0) {
    const nodeId = createNodeId(`config-${config.relativePath}`);

    const nodeData = Object.assign({}, config, {
      id: nodeId,
      parent: parent,
      children: [],
      internal: {
        type: `Config`,
        content: config.relativePath,
        contentDigest: createContentDigest(config.relativePath),
      },
    });
    debug(`Create config node: ${config}`);
    createNode(nodeData);
    createParentChildLink({ parent: getNode(parent), child: getNode(nodeId) });

    return config;
  } else {
    throw `Multiple config nodes was found. ${existedNodes}`;
  }
};
