const createPagesByIndexing = require('./_createPagesByIndexing');
const {
    getTagPageTitle,
    getTagPagePath,
} = require("./utils");

const { makeTagSummaryPayloadWithTag } = require('../makePayloads');

const _createPageForTagsForLocale = async (args) => {
    const { locale, graphql, createPage } = args;
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
            await _createPageForTagsForLocale(args)
        })
    )
};
