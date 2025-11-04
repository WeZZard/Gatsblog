import debug from 'debug';

interface PageData {
  title: string;
  createdTime?: Date;
  isLocalized: boolean;
  lang: string;
  slug: string;
  file: string;
}

interface CreateNodeForPageArgs {
  parent: string;
  page: PageData;
  nodeIdBase: string;
  nodeContent: string;
  getNode: (id: string) => any;
  createNode: (nodeData: any) => void;
  createNodeId: (id: string) => string;
  createContentDigest: (content: string) => string;
  createParentChildLink: (args: { parent: any; child: any }) => void;
}

const logger = debug('gatsby:create-node-for-page');

export function createNodeForPage(args: CreateNodeForPageArgs): PageData {
  const {
    parent,
    page,
    nodeIdBase,
    nodeContent,
    getNode,
    createNode,
    createNodeId,
    createContentDigest,
    createParentChildLink,
  } = args;

  const nodeId = createNodeId(`page-${nodeIdBase}`);
  const nodeData = {
    ...page,
    id: nodeId,
    parent: parent,
    children: [],
    internal: {
      type: 'Page',
      content: nodeContent,
      contentDigest: createContentDigest(nodeContent),
    },
  };

  logger(`Create page node: ${JSON.stringify(page)}`);
  createNode(nodeData);

  createParentChildLink({ parent: getNode(parent), child: getNode(nodeId) });

  return page;
}