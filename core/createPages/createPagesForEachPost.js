const path = require('path');

const Template = path.resolve('src/templates/Post.js');

module.exports = async (args) => {
    const { graphql, actions, getNode } = args;
    const { createPage } = actions;

    const isPreviewEnabled = process.env.GATSBY_IS_PREVIEW_ENABLED || false;
};
