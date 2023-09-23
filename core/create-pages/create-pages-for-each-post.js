const path = require('path');
const debug = require('debug');
const Template = path.resolve('src/templates/Post.js');

module.exports = async args => {
  const { createPagesArgs, siteLang } = args;

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

  const findEarlierPost = (posts, fromIndex, fromPost) => {
    if (fromIndex + 1 < posts.length && posts.length > 1) {
      for (let idx = fromIndex + 1; idx < posts.length; idx++) {
        const post = posts[idx];
        if (post.node.isLocalized === fromPost.node.isLocalized
            && post.node.lang === fromPost.node.lang) {
          return post;
        }
      }
    } else {
      return null;
    }
  }

  const findLaterPost = (posts, fromIndex, fromPost) => {
    if (fromIndex > 0) {
      for (let idx = fromIndex - 1; idx >= 0; idx--) {
        const post = posts[idx];
        if (post.node.isLocalized === fromPost.node.isLocalized
            && post.node.lang === fromPost.node.lang) {
          return post;
        }
      }
      return null;
    } else {
      return null;
    }
  }

  await Promise.all(
    posts.map(async (postNode, index) => {
      const earlierPost = findEarlierPost(posts, index, postNode);
      const laterPost = findLaterPost(posts, index, postNode);

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
