const { createNodeForConfig } = require('../create-node');
const { encrypt } = require('../utils');

const toProtectPrefix = 'toprotect://';

module.exports = args => {
  const {
    node,
    actions,
    getNode,
    getNodesByType,
    createNodeId,
    createContentDigest,
  } = args;

  const { createNode, createParentChildLink } = actions;

  if (node.internal.type === 'ConfigYaml') {
    const { parent, social } = node;

    const rest = Object.assign({}, node);
    delete rest.id;
    delete rest.parent;
    delete rest.children;
    delete rest.internal;
    delete rest.social;

    const parentNode = getNode(parent);

    const relativePath = parentNode.relativePath;

    const protectedSocial = social.map(eachItem => {
      if (eachItem.link.startsWith(toProtectPrefix)) {
        const originalLink = eachItem.link.substring(toProtectPrefix.length);

        return {
          name: eachItem.name,
          icon: eachItem.icon,
          link: `protected://${encrypt(originalLink)}`,
        };
      } else {
        return eachItem;
      }
    });

    const config = Object.assign({}, rest, {
      relativePath,
      social: protectedSocial,
    });

    createNodeForConfig({
      config,
      parent: parent,
      getNode,
      getNodesByType,
      createNode,
      createNodeId,
      createContentDigest,
      createParentChildLink,
    });
  }
};
