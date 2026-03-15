exports.onCreateNode = require(`./core/on-create-node`);

exports.createPages = require(`./core/create-pages`);

exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  const config = getConfig();
  if (config.module && config.module.rules) {
    config.module.rules.forEach(rule => {
      if (rule.oneOf) {
        rule.oneOf.forEach(oneOfRule => {
          if (oneOfRule.use) {
            oneOfRule.use.forEach(loader => {
              if (
                loader.loader &&
                loader.loader.includes('css-loader') &&
                loader.options &&
                loader.options.modules
              ) {
                loader.options.modules.namedExport = false;
              }
            });
          }
        });
      }
    });
  }
  actions.replaceWebpackConfig(config);
};

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
    schema.buildObjectType({
      name: 'Category',
      interfaces: ['Node'],
      fields: {
        name: 'String',
        slug: 'String',
      },
    }),
    schema.buildObjectType({
      name: 'Tag',
      interfaces: ['Node'],
      fields: {
        name: 'String',
        slug: 'String',
      },
    }),
    schema.buildObjectType({
      name: 'Locale',
      interfaces: ['Node'],
      fields: {
        identifier: 'String',
        slug: 'String',
      },
    }),
    `type ConfigSite {
      title: String
      owner: String
      url: String
      lang: String
      description: String
      keywords: [String]
      license: String
      indexing: [ConfigIndexing]
      slogans: [String]
      footerMessages: [String]
    }`,
    `type ConfigIndexing {
      name: String
      isEnabled: Boolean
    }`,
    `type ConfigNavigationItem {
      name: String
      slug: String
      weight: Int
      isVisible: Boolean
    }`,
    `type ConfigNavigation {
      createsNavigationItemsForCategories: Boolean
      overwritingCategoryNavigationItems: [ConfigNavigationItem]
      customNavigationItems: [ConfigNavigationItem]
    }`,
    `type ConfigSocial {
      name: String
      icon: String
      link: String
    }`,
    `type ConfigPagination {
      indexName: String
      itemsPerPage: Int
    }`,
    schema.buildObjectType({
      name: 'Config',
      interfaces: ['Node'],
      fields: {
        relativePath: 'String',
        site: 'ConfigSite',
        navigation: 'ConfigNavigation',
        social: '[ConfigSocial]',
        pagination: '[ConfigPagination]',
      },
    }),
  ];

  createTypes(typeDefs);
};
