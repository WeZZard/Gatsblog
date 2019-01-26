const path = require('path');

const Template = path.resolve('src/templates/Post.js');

module.exports = async (args) => {
    const {
        createPagesArgs,
        pendingSchemaData,
    } = args;

    const { graphql, actions } = createPagesArgs;
    const { createPage } = actions;
};
