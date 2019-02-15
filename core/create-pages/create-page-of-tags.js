const createTaxonomyIndexPages = require('./_create-taxonomy-index-pages');
const { tags: page } = require('./page-meta');
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
    const { locales, tags } = pendingSchemaData;

    const config = indexingConfig.filter(config => config.name === 'Tags')[0]
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
                taxonomies: tags.map(tag => tag.name).sort((t1, t2) => t1 > t2),
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
