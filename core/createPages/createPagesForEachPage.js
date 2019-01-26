const path = require('path');

const Template = path.resolve('src/templates/Page.js');

module.exports = async (args) => {
    const {
        createPagesArgs,
        pendingSchemaData,
    } = args;

    const { graphql, actions } = createPagesArgs;
    const { createPage } = actions;
};
