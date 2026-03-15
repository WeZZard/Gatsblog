exports.onCreateNode = require(`./core/on-create-node`);

exports.createPages = require(`./core/create-pages`);

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;

  const typeDefs = [
    schema.buildObjectType({
      name: 'Post',
      interfaces: ['Node'],
      fields: {
        title: 'String',
        createdTime: 'Date',
        isLocalized: 'Boolean',
        lang: 'String',
        slug: 'String',
        contentFilePath: 'String',
        file: {
          type: 'File',
          extensions: {
            link: { from: 'fileNodeId' },
          },
        },
        isPublished: {
          type: 'Boolean',
          resolve: (source, args, context) => {
            const parent = context.nodeModel.getNodeById({ id: source.parent });
            if (!parent || !parent.frontmatter) return true;
            return (
              parent.frontmatter.isPublished === undefined ||
              parent.frontmatter.isPublished === true
            );
          },
        },
        subtitle: {
          type: 'String',
          resolve: (source, args, context) => {
            const parent = context.nodeModel.getNodeById({ id: source.parent });
            if (parent && parent.frontmatter && parent.frontmatter.subtitle) {
              return parent.frontmatter.subtitle;
            }
            return '';
          },
        },
        lastModifiedTime: {
          type: 'String',
          resolve: (source, args, context) => {
            const parent = context.nodeModel.getNodeById({ id: source.parent });
            if (
              parent &&
              parent.frontmatter &&
              parent.frontmatter.lastModifiedTime
            ) {
              return parent.frontmatter.lastModifiedTime;
            }
            return null;
          },
        },
        license: {
          type: 'String',
          resolve: (source, args, context) => {
            const parent = context.nodeModel.getNodeById({ id: source.parent });
            if (parent && parent.frontmatter && parent.frontmatter.license) {
              return parent.frontmatter.license;
            }
            return null;
          },
        },
        keywords: {
          type: '[String]',
          resolve: (source, args, context) => {
            const parent = context.nodeModel.getNodeById({ id: source.parent });
            if (parent && parent.frontmatter && parent.frontmatter.keywords) {
              return parent.frontmatter.keywords;
            }
            return [];
          },
        },
        tags: {
          type: '[String]',
          resolve: (source, args, context) => {
            const parent = context.nodeModel.getNodeById({ id: source.parent });
            if (parent && parent.frontmatter && parent.frontmatter.tags) {
              return parent.frontmatter.tags;
            }
            return [];
          },
        },
        category: {
          type: 'String',
          resolve: (source, args, context) => {
            const parent = context.nodeModel.getNodeById({ id: source.parent });
            if (parent && parent.frontmatter && parent.frontmatter.category) {
              return parent.frontmatter.category;
            }
            return 'Uncategorized';
          },
        },
      },
    }),
    schema.buildObjectType({
      name: 'Page',
      interfaces: ['Node'],
      fields: {
        title: 'String',
        createdTime: 'Date',
        isLocalized: 'Boolean',
        lang: 'String',
        slug: 'String',
        contentFilePath: 'String',
        file: {
          type: 'File',
          extensions: {
            link: { from: 'fileNodeId' },
          },
        },
        isPublished: {
          type: 'Boolean',
          resolve: (source, args, context) => {
            const parent = context.nodeModel.getNodeById({ id: source.parent });
            if (!parent || !parent.frontmatter) return true;
            return (
              parent.frontmatter.isPublished === undefined ||
              parent.frontmatter.isPublished === true
            );
          },
        },
        subtitle: {
          type: 'String',
          resolve: (source, args, context) => {
            const parent = context.nodeModel.getNodeById({ id: source.parent });
            if (parent && parent.frontmatter && parent.frontmatter.subtitle) {
              return parent.frontmatter.subtitle;
            }
            return '';
          },
        },
        lastModifiedTime: {
          type: 'String',
          resolve: (source, args, context) => {
            const parent = context.nodeModel.getNodeById({ id: source.parent });
            if (
              parent &&
              parent.frontmatter &&
              parent.frontmatter.lastModifiedTime
            ) {
              return parent.frontmatter.lastModifiedTime;
            }
            return null;
          },
        },
        license: {
          type: 'String',
          resolve: (source, args, context) => {
            const parent = context.nodeModel.getNodeById({ id: source.parent });
            if (parent && parent.frontmatter && parent.frontmatter.license) {
              return parent.frontmatter.license;
            }
            return null;
          },
        },
        keywords: {
          type: '[String]',
          resolve: (source, args, context) => {
            const parent = context.nodeModel.getNodeById({ id: source.parent });
            if (parent && parent.frontmatter && parent.frontmatter.keywords) {
              return parent.frontmatter.keywords;
            }
            return [];
          },
        },
      },
    }),
  ];

  createTypes(typeDefs);
};
