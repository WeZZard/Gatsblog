const {
    createNodesForEachTag,
    createNodesForEachCategory,
    createNodesForEachLocale,
} = require('../createNode');

module.exports = async (args) => {
    const { graphql } = args;

    const tags = await createNodesForEachTag(args);
    const categories = await createNodesForEachCategory(args);
    const locales = await createNodesForEachLocale(args);

    // Gatsby.js doesn't immediately update the GraphQL schema after you create
    // the node, we have to pass the following pending data to the create-page
    // function series.
    //
    const pendingSchemaData = {
        tags: tags,
        categories: categories,
        locales: [null, ...locales],
    };

    const result = await graphql(`
    {
        configYaml {
            site {
                indexing {
                    name
                    isEnabled
                }
                lang
                keywords
                description
            }
        }
    }
    `);

    if (result.errors) {
        throw result.errors
    }

    const {
        data: {
            configYaml
        }
    } = result;

    const {
        site: {
            indexing: indexingConfig,
            lang: siteLang,
            keywords: siteKeywords,
            description: siteDescription
        },
    } = configYaml || {
        site : {
            indexing: [],
            lang: 'en-US',
            keywords: [],
            description: '',
        }
    };

    const createPagesArgs = {
        createPagesArgs: args,
        pendingSchemaData,
        indexingConfig,
        siteLang,
        siteKeywords,
        siteDescription,
    };

    await Promise.all(
        [
            require('./createPageOfHome'),
            require('./createPageOfTags'),
            require('./createPageOfCategories'),
            require('./createPagesForEachPost'),
            require('./createPagesForEachPage'),
            require('./createPagesForEachCategory'),
            require('./createPagesForEachTag'),
            require('./createPagesForLocalizedAliasOfEachPost'),
        ].map(async fn => await fn(createPagesArgs))
    );
};
