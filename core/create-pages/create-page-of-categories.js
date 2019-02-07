const createIndexPages = require('./_create-index-pages');
const { categories: page } = require('./page-meta');
const { makeCategorySummaryPayload } = require('../utils');
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

    const config = indexingConfig.filter(config => config.name === 'Categories')[0] || { isEnabled : true };

    if (config.isEnabled) {
        const itemsPerPage = await itemsPerPageForIndexPageName(page.name, graphql);

        const items = await Promise.all(categories.map(async (category) => {
            return await makeCategorySummaryPayload(category, graphql)
        }));

        locales.forEach((locale) => {
            createIndexPages({
                createPage : createPage,
                siteKeywords,
                siteDescription,
                locale: locale,
                itemComponentName : page.itemComponentName,
                layoutComponentName: page.layoutComponentName,
                items,
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
