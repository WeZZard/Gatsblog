const createTaxonomyIndexPages = require('./_create-taxonomy-index-pages');
const { categories: page } = require('./page-meta');
const { itemsPerPageForIndexPageName } = require('../config');

module.exports = async (args) => {
    const {
        createPagesArgs,
        pendingSchemaData,
        indexingConfig,
        siteKeywords,
        siteDescription,
    } = args;

    const { graphql, actions } = createPagesArgs;
    const { createPage } = actions;
    const { locales, categories } = pendingSchemaData;

    const config = indexingConfig.filter(config => config.name === 'Categories')[0]
        || { isEnabled : true };

    if (config.isEnabled) {
        const itemsPerPage = await itemsPerPageForIndexPageName(page.name, graphql);

        locales.forEach((locale) => {
            createTaxonomyIndexPages({
                template: page.name,
                createPage : createPage,
                siteKeywords,
                siteDescription,
                locale: locale,
                componentName : page.componentName,
                taxonomies: categories.map(category => category.name),
                itemsPerPage,
                createPageTitle: page.getPageTitle,
                createPagePath: page.getPagePath,
                showsPageTitle: true,
                previousPageTitle: page.getPreviousPageTitle(locale),
                nextPageTitle: page.getNextPageTitle(locale),
            });
        });
    }
};
