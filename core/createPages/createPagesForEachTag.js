const createIndexPages = require('./_createIndexPages');
const { tag: page } = require('./pageMetadata');
const { makePostExcerptPayload } = require('../Payload');
const { getItemsPerPageInIndexWithName } = require('../config');

module.exports = async (args) => {
    const {
        createPagesArgs,
        pendingSchemaData,
    } = args;

    const { graphql, actions } = createPagesArgs;
    const { createPage } = actions;

    const { tags, categories, locales } = pendingSchemaData;

    await Promise.all(locales.map(async (locale) => {
        const args = {
            locale: locale,
            tags: tags,
            categories: categories,
            graphql: graphql,
            createPage: createPage,
        };
        await _createPageForTagsForLocale(args)
    }));
};

const _createPageForTagsForLocale = async (args) => {
    const { tags, categories, locale, graphql, createPage } = args;

    const itemsPerPage = await getItemsPerPageInIndexWithName(page.name, graphql);

    await Promise.all(tags.map(async (tag) => {
        const result = await graphql(`
            {
                allPost(
                    filter: {
                        tags: { in: "${tag.name}" }
                        locale: { eq: "${locale.identifier}" }
                    }
                    sort: { fields: [createdTime], order: DESC }
                ) {
                    edges {
                        node {
                            title
                            subtitle
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

        if (result.errors) {
            throw result.errors
        }

        const {
            data: {
                allPost,
            },
        } = result;

        const {
            edges: posts
        } = allPost || { edges: [] };

        await createIndexPages({
            graphql: graphql,
            createPage : createPage,
            locale: locale,
            itemComponentName : page.itemComponentName,
            layoutComponentName: page.layoutComponentName,
            primitiveItems: posts || [],
            itemsPerPage: itemsPerPage,
            createItem: async (post) => await makePostExcerptPayload({
                post: post,
                graphql: graphql,
                tags: tags,
                categories: categories,
            }),
            createPageTitle: (locale, pageIndex) => page.getPageTitle(tag, locale, pageIndex),
            createPagePath: (locale, pageIndex) => page.getPagePath(tag, locale, pageIndex),
            showsPageTitle: true,
            previousPageTitle: page.getPreviousPageTitle(locale),
            nextPageTitle: page.getNextPageTitle(locale),
        });
    }));
};
