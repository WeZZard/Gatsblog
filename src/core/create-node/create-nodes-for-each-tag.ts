import { createNodeForTag } from './create-node-for-tag';

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
          tags: string[];
        };
      }>;
    };
  };
  errors?: any;
}

export async function createNodesForEachTag(args: CreatePagesArgs): Promise<any[]> {
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
            tags
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

  const tags = (posts || []).map(post => post.node.tags).flatMap(tag => tag);

  const nonDuplicateTags = new Set(tags);

  return [...nonDuplicateTags].map(tag =>
    createNodeForTag({
      tag: tag,
      getNodesByType: getNodesByType,
      createNode: createNode,
      createNodeId: createNodeId,
      createContentDigest: createContentDigest,
    }),
  );
}