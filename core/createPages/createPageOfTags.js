const createPagesByIndexing = require('./_createPagesByIndexing');
const { tags: page } = require('./pageMetadata');
const { makeTagSummaryPayloadWithTag } = require('../payload');
const { getItemsPerPageInLocation } = require('../config');

const _createPageOfTagForLocale = async (args) => {
    const { locale, graphql, createPage } = args;

    const {
        data: {
            allTag: { edges: tags },
        }
    } = await graphql(`
        {
            allTag {
                edges {
                    node {
                        id
                        name
                        slug
                    }
                }
            }
        }
    `);

    const itemsPerPage = await getItemsPerPageInLocation(page.location, graphql);

    await createPagesByIndexing({
        graphql: graphql,
        createPage : createPage,
        locale: locale,
        itemComponentName : page.itemComponentName,
        layoutComponentName: page.layoutComponentName,
        primitiveItems: tags,
        itemsPerPage: itemsPerPage,
        createItem: async (tag) => await makeTagSummaryPayloadWithTag(tag, graphql),
        createPageTitle: (locale, pageIndex) => page.getPageTitle(locale, pageIndex),
        createPagePath: (locale, pageIndex) => page.getPagePath(locale, pageIndex),
        showsPageTitle: true,
        previousPageTitle: page.getPreviousPageTitle(locale),
        nextPageTitle: page.getNextPageTitle(locale),
    });
};

module.exports = async (args) => {
    const { graphql, actions } = args;
    const { createPage } = actions;

    const { data: { allLocale: { edges: locales } } } = await graphql(`
        {
            allLocale {
                edges {
                    node {
                        identifier
                        slug
                    }
                }
            }
        }
    `);

    await Promise.all(
        locales.map(async (locale) => {
            const args = {
                locale: locale,
                graphql: graphql,
                createPage: createPage,
            };
            await _createPageOfTagForLocale(args)
        })
    )
};
