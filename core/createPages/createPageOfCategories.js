const createIndexPages = require('./_createIndexPages');
const { categories: page } = require('./pageMetadata');
const { makeCategorySummaryPayload } = require('../Payload');
const { getItemsPerPageInIndexWithName } = require('../config');

module.exports = async (args) => {
    const {
        createPagesArgs,
        pendingSchemaData,
        indexingConfig,
    } = args;

    const { graphql, actions } = createPagesArgs;
    const { createPage } = actions;
    const { locales, categories } = pendingSchemaData;

    const config = indexingConfig.filter(config => config.name === 'Categories')[0] || { isEnabled : true };

    if (config.isEnabled) {
        const itemsPerPage = await getItemsPerPageInIndexWithName(page.name, graphql);

        await Promise.all(locales.map(async (locale) => {
            await createIndexPages({
                graphql: graphql,
                createPage : createPage,
                locale: locale,
                itemComponentName : page.itemComponentName,
                layoutComponentName: page.layoutComponentName,
                primitiveItems: categories,
                itemsPerPage: itemsPerPage,
                createItem: async (category) => await makeCategorySummaryPayload(category, graphql),
                createPageTitle: page.getPageTitle,
                createPagePath: page.getPagePath,
                showsPageTitle: true,
                previousPageTitle: page.getPreviousPageTitle(locale),
                nextPageTitle: page.getNextPageTitle(locale),
            });
        }))
    }
};
