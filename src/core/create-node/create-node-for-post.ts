import debug from 'debug';

interface PostData {
  title: string;
  createdTime?: Date;
  isLocalized: boolean;
  lang: string;
  slug: string;
  file: string;
}

interface CreateNodeForPostArgs {
  parent: string;
  post: PostData;
  nodeIdBase: string;
  nodeContent: string;
  getNode: (id: string) => any;
  createNode: (nodeData: any) => void;
  createNodeId: (id: string) => string;
  createContentDigest: (content: string) => string;
  createParentChildLink: (args: { parent: any; child: any }) => void;
}

const logger = debug('gatsby:create-node-for-post');

export function createNodeForPost(args: CreateNodeForPostArgs): PostData {
  const {
    parent,
    post,
    nodeIdBase,
    nodeContent,
    getNode,
    createNode,
    createNodeId,
    createContentDigest,
    createParentChildLink,
  } = args;

  const nodeId = createNodeId(`post-${nodeIdBase}`);
  const nodeData = {
    ...post,
    id: nodeId,
    parent: parent,
    children: [],
    internal: {
      type: 'Post',
      content: nodeContent,
      contentDigest: createContentDigest(nodeContent),
    },
  };

  logger(`Create post node: ${JSON.stringify(post)}`);
  createNode(nodeData);

  createParentChildLink({ parent: getNode(parent), child: getNode(nodeId) });

  return post;
}