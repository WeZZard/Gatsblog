import { createNodeForCategory } from './create-node-for-category';

interface CreatePagesArgs {
  actions: any;
  getNodesByType: any;
  createNodeId: any;
  createContentDigest: any;
  graphql: any;
}

interface PostQueryResult {
  data: {
    allPost: {
      edges: Array<{
        node: {
          category: string;
        };
      }>;
    };
  };
  errors?: any;
}

export async function createNodesForEachCategory(args: CreatePagesArgs): Promise<any[]> {
  const {
    actions,
    getNodesByType,
    createNodeId,
    createContentDigest,
    graphql,
  } = args;

  const { createNode } = actions;

  const result: PostQueryResult = await graphql(`
    {
      allPost {
        edges {
          node {
            category
          }
        }
      }
    }
  `);

  if (result.errors) {
    return [];
  }

  const {
    data: {
      allPost: { edges: posts },
    },
  } = result;

  const categories = (posts || []).map(post => post.node.category);

  const nonDuplicateCategories = new Set(categories);

  return [...nonDuplicateCategories].map(category =>
    createNodeForCategory({
      category: category,
      getNodesByType: getNodesByType,
      createNode: createNode,
      createNodeId: createNodeId,
      createContentDigest: createContentDigest,
    }),
  );
}