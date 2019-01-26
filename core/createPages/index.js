const createNodesForEachTag = require('../createNode/createNodesForEachTag');
const createNodesForEachCategory = require('../createNode/createNodesForEachCategory');
const createNodesForEachLocale = require('../createNode/createNodesForEachLocale');

module.exports = async (args) => {
    // Gatsby.js doesn't create schema after you create the node immediately,
    // we have to pass the following pending data to the create-page function
    // series.
    //
    const pendingSchemaData = {
        tags: await createNodesForEachTag(args),
        categories: await createNodesForEachCategory(args),
        locales: await createNodesForEachLocale(args),
    };

    [
        require('./createPageOfHome'),
        require('./createPageOfTags'),
        require('./createPageOfCategories'),
        require('./createPagesForEachPost'),
        require('./createPagesForEachPage'),
        require('./createPagesForEachCategory'),
        require('./createPagesForEachTag'),
    ].forEach(_ => _(args, pendingSchemaData));
};
