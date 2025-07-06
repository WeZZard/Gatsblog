import debug from 'debug';

interface ConfigData {
  relativePath: string;
  [key: string]: any;
}

interface CreateNodeForConfigArgs {
  config: ConfigData;
  parent: string;
  getNode: (id: string) => any;
  getNodesByType: (type: string) => any[];
  createNode: (nodeData: any) => void;
  createNodeId: (id: string) => string;
  createContentDigest: (content: string) => string;
  createParentChildLink: (args: { parent: any; child: any }) => void;
}

const logger = debug('gatsby:create-node-for-config');

export function createNodeForConfig(args: CreateNodeForConfigArgs): ConfigData {
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

  const existedNodes = getNodesByType('Config').filter(
    (node: any) => node.relativePath === config.relativePath,
  );

  if (existedNodes.length === 1) {
    const node = existedNodes[0];
    if (node.relativePath !== config.relativePath) {
      throw new Error(`Duplicate config for "${node.relativePath}".`);
    }
    logger(`Returns the data of existed config node: ${JSON.stringify(node)}`);

    return config;
  } else if (existedNodes.length === 0) {
    const nodeId = createNodeId(`config-${config.relativePath}`);

    const nodeData = {
      ...config,
      id: nodeId,
      parent: parent,
      children: [],
      internal: {
        type: 'Config',
        content: config.relativePath,
        contentDigest: createContentDigest(config.relativePath),
      },
    };
    
    logger(`Create config node: ${JSON.stringify(config)}`);
    createNode(nodeData);
    createParentChildLink({ parent: getNode(parent), child: getNode(nodeId) });

    return config;
  } else {
    throw new Error(`Multiple config nodes was found. ${JSON.stringify(existedNodes)}`);
  }
}