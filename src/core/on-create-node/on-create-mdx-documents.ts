import type { GatsbyNode } from "gatsby";
import mdxMetadata from '../mdx/mdx-metadata';
import { createNodeForPost, createNodeForPage } from '../create-node';
import debug from 'debug';

interface OnCreateNodeArgs {
  node: any;
  actions: any;
  getNode: (id: string) => any;
  createNodeId: (id: string) => string;
  createContentDigest: (content: string) => string;
}

const logger = debug('gatsby:on-create-mdx-documents');

export default function onCreateMdxDocuments(args: OnCreateNodeArgs): void {
  const { node, actions, getNode, createNodeId, createContentDigest } = args;
  const { createNode, createParentChildLink } = actions;

  if (node.internal.type === 'Mdx') {
    const isPreviewEnabled = process.env.GATSBY_IS_PREVIEW_ENABLED === 'true';
    
    const metadata = mdxMetadata(args as any);
    const parentNode = getNode(node.parent);
    const absolutePath = parentNode?.absolutePath;

    if (metadata && absolutePath && (isPreviewEnabled || (!isPreviewEnabled && metadata.isPublished))) {
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
            nodeContent: (node as any).rawBody || '',
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
            nodeContent: (node as any).rawBody || '',
            getNode,
            createNode,
            createNodeId,
            createContentDigest,
            createParentChildLink,
          });
          break;
        default:
          logger(`Unexpected document type: ${metadata.documentType}.`);
      }
    }
  }
}