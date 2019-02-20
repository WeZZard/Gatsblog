const MDXMetadata = require('../MDX/MDXMetadata');
const { createNodeForPost, createNodeForPage } = require('../create-node');
const debug = require('debug');

module.exports = args => {
  const { node, actions, getNode, createNodeId, createContentDigest } = args;

  const { createNode, createParentChildLink } = actions;

  if (node.internal.type === 'Mdx') {
    const isPreviewEnabled = process.env.GATSBY_IS_PREVIEW_ENABLED || false;

    const metadata = new MDXMetadata(args);

    if (isPreviewEnabled || metadata.isPublished) {
      switch (metadata.documentType) {
        case 'Post':
          createNodeForPost({
            parent: node.id,
            post: {
              title: metadata.title,
              subtitle: metadata.subtitle,
              documentIdentifier: metadata.documentIdentifier,
              isPublished: metadata.isPublished,
              createdTime: metadata.createdTime,
              lastModifiedTime: metadata.lastModifiedTime,
              slug: metadata.slug,
              lang: metadata.lang,
              isLocalized: metadata.isLocalized,
              license: metadata.license,
              file: metadata.inlineFileLink,
            },
            nodeIdBase: metadata.relativePath,
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
              subtitle: metadata.subtitle,
              documentIdentifier: metadata.documentIdentifier,
              isPublished: metadata.isPublished,
              createdTime: metadata.createdTime,
              lastModifiedTime: metadata.lastModifiedTime,
              slug: metadata.slug,
              lang: metadata.lang,
              isLocalized: metadata.isLocalized,
              license: metadata.license,
              file: metadata.inlineFileLink,
            },
            nodeIdBase: metadata.relativePath,
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
