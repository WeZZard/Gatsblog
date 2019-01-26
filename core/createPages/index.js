const {
    createNodesForEachTag,
    createNodesForEachCategory,
    createNodesForEachLocale,
} = require('../createNode');

module.exports = async (args) => {
    const { graphql } = args;

    // Gatsby.js doesn't update the GraphQL schema after you create the node
    // immediately, we have to pass the following pending data to the
    // create-page function series.
    //
    const pendingSchemaData = {
        tags: await createNodesForEachTag(args),
        categories: await createNodesForEachCategory(args),
        locales: await createNodesForEachLocale(args),
    };

    const {
        data: {
            configYaml: {
                site: {
                    indexing: indexingConfig
                }
            }
        }
    } = await graphql(`
    {
        configYaml {
            site {
                indexing {
                    name
                    isEnabled
                }
            }
        }
    }
    `);

    const createPagesArgs = {
        createPagesArgs: args,
        pendingSchemaData,
        indexingConfig,
    };

    [
        require('./createPageOfHome'),
        require('./createPageOfTags'),
        require('./createPageOfCategories'),
        require('./createPagesForEachPost'),
        require('./createPagesForEachPage'),
        require('./createPagesForEachCategory'),
        require('./createPagesForEachTag'),
        require('./createPagesForLocalizedAliasOfEachPost'),
    ].forEach(_ => _(createPagesArgs));
};
