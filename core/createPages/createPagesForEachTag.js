const createPagesByIndexing = require('./_createPagesByIndexing');
const { tag: page } = require('./pageMetadata');
const { makePostExcerptPayloadWithPost } = require('../payload');
const { getItemsPerPageInLocation } = require('../config');

const _createPageForTagsForLocale = async (args) => {
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

    await Promise.all(tags.map(async (tag) => {
        console.log(`Creating tag page(${tag.node.name}) for locale: ${locale.node.identifier}`);

        const {
            data: { allPost },
        } = await graphql(`
            {
                allPost(
                    filter: {
                        tags: { in: "${tag.node.id}" }
                        locale: { eq: "${locale.node.id}" }
                    }
                    sort: { fields: [createdTime], order: DESC }
                ) {
                    edges {
                        node {
                            title
                            createdTime
                            tags
                            category
                            slug
                            parent {
                                id
                            }
                        }
                    }
                }
            }
        `);

        const { edges: posts } = allPost || { edges: [] };

        await createPagesByIndexing({
            graphql: graphql,
            createPage : createPage,
            locale: locale,
            itemComponentName : page.itemComponentName,
            layoutComponentName: page.layoutComponentName,
            primitiveItems: posts,
            itemsPerPage: itemsPerPage,
            createItem: async (post) => await makePostExcerptPayloadWithPost(post, graphql),
            createPageTitle: (locale, pageIndex) => page.getPageTitle(tag, locale, pageIndex),
            createPagePath: (locale, pageIndex) => page.getPagePath(tag, locale, pageIndex),
            showsPageTitle: true,
            previousPageTitle: page.getPreviousPageTitle(locale),
            nextPageTitle: page.getNextPageTitle(locale),
        });
        console.log(`Created tag page(${tag.node.name}) for locale: ${locale.node.identifier}`);
    }));
};

module.exports = async (args) => {
    const { graphql, actions } = args;
    const { createPage } = actions;

    const { data: { allLocale: { edges: locales } } } = await graphql(`
        {
            allLocale {
                edges {
                    node {
                        id
                        identifier
                        slug
                    }
                }
            }
        }
    `);

    await Promise.all(locales.map(async (locale) => {
        const args = {
            locale: locale,
            graphql: graphql,
            createPage: createPage,
        };
        await _createPageForTagsForLocale(args)
    }));
};
