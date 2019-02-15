const createPostIndexPages = require('./_create-post-index-pages');
const { tag: meta } = require('./post-index-meta');
const { itemsPerPageForIndexPageName } = require('../config');

module.exports = async (args) => {
    const {
        createPagesArgs,
        pendingSchemaData,
        siteLang,
        siteKeywords,
        siteDescription,
    } = args;

    const { graphql, actions } = createPagesArgs;
    const { createPage } = actions;

    const { tags, locales } = pendingSchemaData;

    await Promise.all(locales.map(async (locale) => {
        const args = {
            locale,
            tags,
            graphql,
            createPage,
            siteLang,
            siteKeywords,
            siteDescription,
        };
        await _createPageForTagsForLocale(args)
    }));
};

const _createPageForTagsForLocale = async (args) => {
    const {
        tags,
        locale,
        siteLang,
        siteKeywords,
        siteDescription,
        graphql,
        createPage
    } = args;

    const itemsPerPage = await itemsPerPageForIndexPageName(meta.name, graphql);

    await Promise.all(
        tags.map(async tag => {
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
                                id
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

            await createPostIndexPages({
                createPage,
                siteKeywords,
                siteDescription,
                locale: locale,
                items: posts.map(post => post.node.id),
                itemsPerPage,
                createPageTitle: (locale, pageIndex) => meta.getPageTitle(tag, locale, pageIndex),
                createPagePath: (locale, pageIndex) => meta.getPagePath(tag, locale, pageIndex),
                showsPageTitle: true,
                previousPageTitle: meta.getPreviousPageTitle(locale),
                nextPageTitle: meta.getNextPageTitle(locale),
            });
        })
    );
};
