const createPagesByIndexing = require('./_createPagesByIndexing');
const { makeTagSummaryPayloadWithTag } = require('../payload');

const _createPageOfTagForLocale = async (args) => {
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
            await _createPageOfTagForLocale(args)
        })
    )
};
