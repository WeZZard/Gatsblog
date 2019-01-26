const createIndexPages = require('./_createIndexPages');
const { tags: page } = require('./pageMetadata');
const { makeTagSummaryPayload } = require('../Payload');
const { getItemsPerPageInIndexWithName } = require('../config');

module.exports = async (args, pendingSchemaData) => {
    const { graphql, actions } = args;
    const { createPage } = actions;
    const { locales, tags } = pendingSchemaData;

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
            createItem: async (tag) => await makeTagSummaryPayload(tag, graphql),
            createPageTitle: page.getPageTitle,
            createPagePath: page.getPagePath,
            showsPageTitle: true,
            previousPageTitle: page.getPreviousPageTitle(locale),
            nextPageTitle: page.getNextPageTitle(locale),
        });
    }))
};