const createNodeForLocale = require('./createNodeForLocale');

module.exports = async (args) => {
    const {
        actions,
        getNodesByType,
        createNodeId,
        createContentDigest,
        graphql,
    } = args;

    const { createNode } = actions;

    const result = await graphql(`
        {
            allPost {
                edges {
                    node {
                        lang
                    }
                }
            }
            allPage {
                edges {
                    node {
                        lang
                    }
                }
            }
            configYaml {
                site {
                    lang
                }
            }
        }
    `);

    if (result.errors && !result.data) {
        throw result.errors
    }

    const { data } = result;

    const { allPost, allPage, configYaml } = data || {
        allPost: { edges: [] },
        allPage: { edges: [] },
        configYaml: { site: { lang: 'en-US' } },
    };

    const { edges: posts } = allPost || { edges: [] };

    const { edges: pages } = allPage || { edges: [] };

    const { site } = configYaml || { site: { lang: 'en-US' } };

    const { lang: siteLanguage } = site || { lang: 'en-US' };

    const contentLanguages = [...posts, ...pages]
        .map(object => object.node.lang)
        .filter(_ => _);

    const allLanguages = [...contentLanguages, siteLanguage];

    const nonDuplicateLocales = new Set(allLanguages);

    return [...nonDuplicateLocales]
        .map(locale => createNodeForLocale({
        locale: locale,
        getNodesByType: getNodesByType,
        createNode: createNode,
        createNodeId: createNodeId,
        createContentDigest: createContentDigest
    }));
};
