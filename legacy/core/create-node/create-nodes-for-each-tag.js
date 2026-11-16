const createNodeForTag = require('./create-node-for-tag');

module.exports = async args => {
  const {
    actions,
    getNodesByType,
    createNodeId,
    createContentDigest,
    graphql,
  } = args;

  const { createNode } = actions;

  const result = await graphql(`
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

  const tags = (posts || []).map(post => post.node.tags).flatMap(_ => _);

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
};
