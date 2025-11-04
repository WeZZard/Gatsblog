import type { GatsbyNode } from "gatsby";
import { createNodeForConfig } from '../create-node/create-node-for-config';
import { encrypt } from '../encryption';

interface OnCreateNodeArgs {
  node: any;
  actions: any;
  getNode: (id: string) => any;
  getNodesByType: (type: string) => any[];
  createNodeId: (id: string) => string;
  createContentDigest: (content: string) => string;
}

const TO_PROTECT_PREFIX = 'toprotect://';

export default function onCreateConfigYaml(args: OnCreateNodeArgs): void {
  const { node, actions, getNode, getNodesByType, createNodeId, createContentDigest } = args;
  const { createNode, createParentChildLink } = actions;

  if (node.internal.type === 'ConfigYaml') {
    const { parent, social, ...configData } = node;
    
    // Remove Gatsby internal fields
    delete configData.id;
    delete configData.children;
    delete configData.internal;

    const parentNode = getNode(parent);
    const relativePath = parentNode?.relativePath;

    // Process social links - encrypt protected ones
    const processedSocial = social?.map((item: any) => {
      if (item.link?.startsWith(TO_PROTECT_PREFIX)) {
        const linkToEncrypt = item.link.substring(TO_PROTECT_PREFIX.length);
        return {
          name: item.name,
          icon: item.icon,
          link: `protected://${encrypt(linkToEncrypt)}`,
        };
      }
      return item;
    }) || [];

    const config = {
      ...configData,
      relativePath,
      social: processedSocial,
    };

    createNodeForConfig({
      config,
      parent,
      getNode,
      getNodesByType,
      createNode,
      createNodeId,
      createContentDigest,
      createParentChildLink,
    });
  }
}