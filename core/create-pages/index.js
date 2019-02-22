const {
  createNodesForEachTag,
  createNodesForEachCategory,
  createNodesForEachLocale,
} = require('../create-node');

module.exports = async args => {
  const { graphql } = args;

  const tags = await createNodesForEachTag(args);
  const categories = await createNodesForEachCategory(args);
  const locales = await createNodesForEachLocale(args);

  const result = await graphql(`
    {
      config: configYaml {
        site {
          indexing {
            name
            isEnabled
          }
          lang
          keywords
          description
          license
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors;
  }

  const {
    data: { config },
  } = result;

  const {
    site: {
      indexing: indexingConfig,
      lang: siteLang,
      keywords: siteKeywords,
      description: siteDescription,
      license: defaultLicense,
    },
  } = config || {
    site: {
      indexing: [],
      lang: 'en-US',
      keywords: [],
      description: '',
      license: 'cc4.0-by-nc-nd',
    },
  };

  // Gatsby.js doesn't immediately update the GraphQL schema after you create
  // the node, we have to pass the following pending data to the create-page
  // function series.
  //
  const pendingSchemaData = {
    tags: tags,
    categories: categories,
    locales: [
      null,
      ...locales.filter(locale => locale.identifier !== siteLang),
    ],
  };

  const createPagesArgs = {
    createPagesArgs: args,
    pendingSchemaData,
    indexingConfig,
    siteLang,
    siteKeywords,
    siteDescription,
    defaultLicense,
  };

  await Promise.all(
    [
      require('./create-page-of-home'),
      require('./create-page-of-categories'),
      require('./create-page-of-tags'),
      require('./create-pages-for-each-category'),
      require('./create-pages-for-each-tag'),
      require('./create-pages-for-each-post'),
      require('./create-pages-for-each-page'),
    ].map(async createPages => await createPages(createPagesArgs)),
  );
};
