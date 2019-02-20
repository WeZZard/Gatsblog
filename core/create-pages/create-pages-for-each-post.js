const path = require('path');
const debug = require('debug');
const Template = path.resolve('src/templates/Post.js');

module.exports = async args => {
  const { createPagesArgs } = args;

  const { graphql, actions } = createPagesArgs;
  const { createPage } = actions;

  const result = await graphql(`
    {
      allPost(sort: { fields: [createdTime], order: DESC }) {
        edges {
          node {
            id
            slug
            lang
            isLocalized
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors;
  }

  const {
    data: { allPost },
  } = result;

  const { edges: posts } = allPost || { edges: [] };

  await Promise.all(
    posts.map(async (postNode, index) => {
      const earlierPost = index + 1 < posts.length ? posts[index + 1] : null;

      const laterPost = index - 1 >= 0 ? posts[index - 1] : null;

      const localeSlug = postNode.node.isLocalized
        ? `/${postNode.node.lang}`
        : '';

      const originalPath = [localeSlug, postNode.node.slug]
        .filter(_ => _)
        .join('');

      let paths = [originalPath];

      if (!postNode.node.isLocalized && postNode.node.lang) {
        const localizedPath = `/${postNode.node.lang}/${postNode.node.slug}`;
        paths.push(localizedPath);
      }

      paths.forEach(path => {
        debug(`Create page for post: ${path}.`);

        createPage({
          path: path,
          component: Template,
          context: {
            postId: postNode.node.id,
            earlierPostId: (earlierPost && earlierPost.node.id) || null,
            laterPostId: (laterPost && laterPost.node.id) || null,
          },
        });
      });
    }),
  );
};
