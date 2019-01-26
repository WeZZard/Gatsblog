const createIndexPages = require('./_createIndexPages');
const { tags: page } = require('./pageMetadata');
const { makeTagSummaryPayload } = require('../Payload');
const { getItemsPerPageInIndexWithName } = require('../config');

module.exports = async (args) => {
    const {
        createPagesArgs,
        pendingSchemaData,
        indexingConfig,
    } = args;

    const { graphql, actions } = createPagesArgs;
    const { createPage } = actions;
    const { locales, tags } = pendingSchemaData;

    const config = indexingConfig.filter(config => config.name === 'Tags')[0] || { isEnabled : true };

    if (config.isEnabled) {
        const itemsPerPage = await getItemsPerPageInIndexWithName(page.name, graphql);

        await Promise.all(locales.map(async (locale) => {
            await createIndexPages({
                graphql: graphql,
                createPage : createPage,
                locale: locale,
                itemComponentName : page.itemComponentName,
                layoutComponentName: page.layoutComponentName,
                primitiveItems: tags,
                itemsPerPage: itemsPerPage,
                createItem: async (tag) => await makeTagSummaryPayload(tag, graphql), // Needs to know is-preview-enabled.
                createPageTitle: page.getPageTitle,
                createPagePath: page.getPagePath,
                showsPageTitle: true,
                previousPageTitle: page.getPreviousPageTitle(locale),
                nextPageTitle: page.getNextPageTitle(locale),
            });
        }))
    }
};
