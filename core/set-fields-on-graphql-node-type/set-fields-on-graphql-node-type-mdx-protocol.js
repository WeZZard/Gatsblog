const { GraphQLString, GraphQLBoolean } = require('gatsby/graphql');

module.exports = async args => {
  const { type, getNode } = args;

  if (type.name === 'Post' || type.name === 'Page') {
    return {
      isPublished: {
        type: GraphQLBoolean,
        resolve: source => {
          const parent = getNode(source.parent);
          return (
            parent.frontmatter.isPublished === undefined ||
            parent.frontmatter.isPublished === true
          );
        },
      },
      subtitle: {
        type: GraphQLString,
        resolve: source => {
          const parent = getNode(source.parent);
          if (parent.frontmatter.subtitle) {
            return parent.frontmatter.subtitle;
          }
          return '';
        },
      },
      lastModifiedTime: {
        type: GraphQLString,
        resolve: source => {
          const parent = getNode(source.parent);
          if (parent.frontmatter.lastModifiedTime) {
            return parent.frontmatter.lastModifiedTime;
          }
          return null;
        },
      },
      license: {
        type: GraphQLString,
        resolve: source => {
          const parent = getNode(source.parent);
          if (parent.frontmatter.license) {
            return parent.frontmatter.license;
          }
          return null;
        },
      },
    };
  }

  return {};
};
