interface CreateNodeForCategoryArgs {
  category: string;
  getNodesByType: (type: string) => any[];
  createNode: (nodeData: any) => void;
  createNodeId: (id: string) => string;
  createContentDigest: (data: any) => string;
}

interface CategoryData {
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

export function createNodeForCategory(args: CreateNodeForCategoryArgs): CategoryData {
  const {
    category,
    getNodesByType,
    createNode,
    createNodeId,
    createContentDigest,
  } = args;

  const kebabCategory = kebabCase(category);
  const categoryData: CategoryData = { name: category, slug: `/category/${kebabCategory}` };
  
  const existedNodes = getNodesByType('Category').filter(
    (node: any) => node.slug === categoryData.slug,
  );
  
  if (existedNodes.length === 1) {
    const node = existedNodes[0];
    if (node.name !== categoryData.name) {
      throw new Error(`Category "${node.name}" and "${
        categoryData.name
      }" shares the same slug: ${node.slug}, which is not allowed.`);
    }
    console.debug(`Returns the data of existed category node: ${node}`);
    return categoryData;
  } else if (existedNodes.length === 0) {
    const nodeId = createNodeId(`category-${kebabCategory}`);
    const nodeData = {
      ...categoryData,
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: 'Category',
        content: category,
        contentDigest: createContentDigest(categoryData.slug),
      },
    };
    console.debug(`Create category node: ${category}`);
    createNode(nodeData);
    return categoryData;
  } else {
    throw new Error(`Multiple category nodes was found. ${existedNodes}`);
  }
}