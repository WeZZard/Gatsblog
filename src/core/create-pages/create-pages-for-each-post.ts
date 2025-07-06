import path from 'path';
import debug from 'debug';
import {
  CreatePagesArgsExtended,
  GraphQLResult,
  AllPostQueryResult,
  PostNode,
  PostPageContext,
} from '../../types/page-generation';

const Template = path.resolve('src/templates/Post.tsx');

export default async function createPagesForEachPost(
  args: CreatePagesArgsExtended
): Promise<void> {
  const { createPagesArgs, siteLang } = args;
  const { graphql, actions } = createPagesArgs;
  const { createPage } = actions;

  // Preserve exact GraphQL query structure
  const result: GraphQLResult<AllPostQueryResult> = await graphql(`
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

  // Preserve exact error handling pattern
  if (result.errors) {
    throw result.errors;
  }

  const {
    data,
  } = result;

  const { allPost } = data || {};
  const { edges: posts } = allPost || { edges: [] };

  // Preserve exact navigation helper functions
  const findEarlierPost = (
    posts: Array<{ node: PostNode }>,
    fromIndex: number,
    fromPost: { node: PostNode }
  ): { node: PostNode } | null => {
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
    return null;
  };

  const findLaterPost = (
    posts: Array<{ node: PostNode }>,
    fromIndex: number,
    fromPost: { node: PostNode }
  ): { node: PostNode } | null => {
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
  };

  // Preserve exact Promise.all parallel execution pattern
  await Promise.all(
    posts.map(async (postNode, index) => {
      const earlierPost = findEarlierPost(posts, index, postNode);
      const laterPost = findLaterPost(posts, index, postNode);

      // Preserve exact empty slug check and console log
      if (postNode.node.slug == '') {
        console.log(`postNode.node.slug is empty: ${postNode.node}`);
        return;
      }

      // Preserve exact locale slug logic
      const localeSlug = postNode.node.isLocalized
        ? `/${postNode.node.lang}`
        : '';

      const originalPath = [localeSlug, postNode.node.slug]
        .filter(str => str != '')
        .join('');

      // Preserve exact comment and workaround logic
      // A workaround that fixes:
      // create page for path: /; component: /opt/build/repo/src/templates/Post.js; context: [object Object]
      // create page for path: //post/2025/03/when-the-swift-compiler-deleted-code-in-stdlib-9067; component: /opt/build/repo/src/templates/Post.js; context: [object Object]
      let paths = [originalPath == '' ? '/' : originalPath];

      // Preserve exact duplicate path logic for non-localized posts
      if (!postNode.node.isLocalized && postNode.node.lang) {
        const localizedPath = `/${postNode.node.lang}/${postNode.node.slug}`;
        paths.push(localizedPath);
      }

      // Preserve exact path creation loop
      paths.forEach(path => {
        debug(`Create page for post: ${path}.`);

        // Preserve exact context structure
        let context: PostPageContext = {
          postId: postNode.node.id,
          earlierPostId: (earlierPost && earlierPost.node.id) || null,
          laterPostId: (laterPost && laterPost.node.id) || null,
        };

        // Preserve exact console.log statement
        console.log(`create page for path: ${path}; component: ${Template}; context: ${context}`);

        // Create the page - preserve exact function call
        createPage({
          path: path,
          component: Template,
          context: context,
        });
      });
    }),
  );
}