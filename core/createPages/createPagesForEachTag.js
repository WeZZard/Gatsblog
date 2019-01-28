const createIndexPages = require('./_createIndexPages');
const { tag: page } = require('./pageMetadata');
const { makePostPayload } = require('../Payload');
const { getItemsPerPageInIndexWithName } = require('../config');

module.exports = async (args) => {
    const {
        createPagesArgs,
        pendingSchemaData,
        siteLang,
    } = args;

    const { graphql, actions } = createPagesArgs;
    const { createPage } = actions;

    const { tags, categories, locales } = pendingSchemaData;

    await Promise.all(locales.map(async (locale) => {
        const args = {
            locale,
            tags,
            categories,
            graphql,
            createPage,
            siteLang
        };
        await _createPageForTagsForLocale(args)
    }));
};

const _createPageForTagsForLocale = async (args) => {
    const { tags, categories, locale, siteLang, graphql, createPage } = args;

    const itemsPerPage = await getItemsPerPageInIndexWithName(page.name, graphql);

    await Promise.all(tags.map(async (tag) => {
        const postFilter = locale
            ? (locale.identifier === siteLang
                    ? `lang: { in: [ null, "${locale.identifier}" ] }`
                    : `lang: { eq: "${locale.identifier}" }`
            ) : 'isLocalized: { eq: false }';

        const result = await graphql(`
            {
                allPost(
                    filter: {
                        tags: { in: "${tag.name}" }
                        ${postFilter}
                    }
                    sort: { fields: [createdTime], order: DESC }
                ) {
                    edges {
                        node {
                            title
                            subtitle
                            createdTime
                            documentIdentifier
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
            createItem: async (post) => await makePostPayload({
                post: post,
                graphql: graphql,
                tags: tags,
                categories: categories,
                style: "Excerpt",
            }),
            createPageTitle: (locale, pageIndex) => page.getPageTitle(tag, locale, pageIndex),
            createPagePath: (locale, pageIndex) => page.getPagePath(tag, locale, pageIndex),
            showsPageTitle: true,
            previousPageTitle: page.getPreviousPageTitle(locale),
            nextPageTitle: page.getNextPageTitle(locale),
        });
    }));
};
