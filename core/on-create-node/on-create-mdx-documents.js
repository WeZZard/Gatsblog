const MDXMetadata = require('../MDX/MDXMetadata');
const { createNodeForPost, createNodeForPage } = require('../create-node');
const debug = require('debug');

module.exports = args => {
  const { node, actions, getNode, createNodeId, createContentDigest } = args;

  const { createNode, createParentChildLink } = actions;

  if (node.internal.type === 'Mdx') {
    const isPreviewEnabled = process.env.GATSBY_IS_PREVIEW_ENABLED === 'true';

    const metadata = new MDXMetadata(args);

    const parentNode = getNode(node.parent);

    const absolutePath = parentNode.absolutePath;

    if (isPreviewEnabled || (!isPreviewEnabled && metadata.isPublished)) {
      switch (metadata.documentType) {
        case 'Post':
          createNodeForPost({
            parent: node.id,
            post: {
              title: metadata.title,
              createdTime: metadata.createdTime,
              isLocalized: metadata.isLocalized,
              lang: metadata.lang,
              slug: metadata.slug,
              file: metadata.relativePath,
            },
            nodeIdBase: absolutePath,
            nodeContent: node.rawBody,
            getNode,
            createNode,
            createNodeId,
            createContentDigest,
            createParentChildLink,
          });
          break;
        case 'Page':
          createNodeForPage({
            parent: node.id,
            page: {
              title: metadata.title,
              createdTime: metadata.createdTime,
              isLocalized: metadata.isLocalized,
              lang: metadata.lang,
              slug: metadata.slug,
              file: metadata.relativePath,
            },
            nodeIdBase: absolutePath,
            nodeContent: node.rawBody,
            getNode,
            createNode,
            createNodeId,
            createContentDigest,
            createParentChildLink,
          });
          break;
        default:
          debug(`Unexpected document type: ${metadata.documentType}.`);
      }
    }
  }
};
