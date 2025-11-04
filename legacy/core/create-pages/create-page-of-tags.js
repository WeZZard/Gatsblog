const createTaxonomyIndexPages = require('./_create-taxonomy-index-pages');
const { tags: meta } = require('./taxonomy-index-meta');
const { itemsPerPageForIndexPageName } = require('../config');

module.exports = async args => {
  const {
    createPagesArgs,
    pendingSchemaData,
    indexingConfig,
    siteKeywords,
    siteDescription,
  } = args;

  const { graphql, actions } = createPagesArgs;
  const { createPage } = actions;
  const { locales, tags } = pendingSchemaData;

  const config = indexingConfig.filter(config => config.name === 'Tags')[0] || {
    isEnabled: true,
  };

  if (config.isEnabled) {
    const itemsPerPage = await itemsPerPageForIndexPageName(meta.name, graphql);

    locales.forEach(locale => {
      createTaxonomyIndexPages({
        type: 'tag',
        createPage: createPage,
        siteKeywords,
        siteDescription,
        locale: locale,
        componentName: meta.componentName,
        taxonomies: tags.map(tag => tag.name).sort((t1, t2) => t1 > t2),
        itemsPerPage,
        createPageTitle: meta.getPageTitle,
        createPagePath: meta.getPagePath,
        showsPageTitle: true,
        previousPageTitle: meta.getPreviousPageTitle(locale),
        nextPageTitle: meta.getNextPageTitle(locale),
      });
    });
  }
};
