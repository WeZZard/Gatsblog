interface CreateNodeForTagArgs {
  tag: string;
  getNodesByType: (type: string) => any[];
  createNode: (nodeData: any) => void;
  createNodeId: (id: string) => string;
  createContentDigest: (data: any) => string;
}

interface TagData {
  name: string;
  slug: string;
}

// Convert to kebab-case (simple implementation to avoid lodash dependency)
function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export function createNodeForTag(args: CreateNodeForTagArgs): TagData {
  const {
    tag,
    getNodesByType,
    createNode,
    createNodeId,
    createContentDigest,
  } = args;

  const kebabTag = kebabCase(tag);
  const tagData: TagData = { name: tag, slug: `/tag/${kebabTag}` };
  
  const existedNodes = getNodesByType('Tag').filter(
    (node: any) => node.slug === tagData.slug,
  );
  
  if (existedNodes.length === 1) {
    const node = existedNodes[0];
    if (node.name !== tagData.name) {
      throw new Error(`Tag "${node.name}" and "${tagData.name}" shares the same slug: ${
        node.slug
      }, which is not allowed.`);
    }
    console.debug(`Returns the data of existed tag node: ${node}`);
    return tagData;
  } else if (existedNodes.length === 0) {
    const nodeId = createNodeId(`tag-${kebabTag}`);
    const nodeData = {
      ...tagData,
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: 'Tag',
        content: tag,
        contentDigest: createContentDigest(tagData.slug),
      },
    };
    console.debug(`Create tag node: ${tag}`);
    createNode(nodeData);
    return tagData;
  } else {
    throw new Error(`Multiple tag nodes was found. ${existedNodes}`);
  }
}