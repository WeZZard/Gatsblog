const path = require('path');
const assert = require('assert');
const { makePostPayload } = require('../utils');
const Template = path.resolve('src/templates/Post.js');

module.exports = async (args) => {
    const {
        createPagesArgs,
        pendingSchemaData,
        siteLang,
        defaultLicense
    } = args;

    const { graphql, actions } = createPagesArgs;
    const { createPage } = actions;
    const { tags, categories } = pendingSchemaData;

    const result = await graphql(`
        {
            allPost(sort: { fields: [createdTime], order: DESC }) {
                edges {
                    node {
                        title
                        subtitle
                        isPublished
                        createdTime
                        lastModifiedTime
                        documentIdentifier
                        license
                        slug
                        lang
                        isLocalized
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

    const { data: { allPost } } = result;

    const { edges: posts } = allPost || { edges: [] };

    await Promise.all(
        posts.map( async (postNode, index) => {
            const postPayload = await makePostPayload({
                post: postNode,
                tags,
                categories,
                graphql,
                style: 'FullText',
            });

            let earlierPostPayload = null;
            if (index - 1 >= 0) {
                const earlierPost = posts[index - 1];
                earlierPostPayload = await makePostPayload({
                    post: earlierPost,
                    tags,
                    categories,
                    graphql,
                    style: 'Excerpt',
                })
            }

            let laterPostPayload = null;
            if (index + 1 < posts.length) {
                const laterPost = posts[index + 1];
                laterPostPayload  = await makePostPayload({
                    post: laterPost,
                    tags,
                    categories,
                    graphql,
                    style: 'Excerpt',
                })
            }

            let localeSlug = postNode.node.isLocalized
                ? `/${postNode.node.lang}`
                : '';

            let path = [localeSlug, postNode.node.slug].filter(_ => _).join('');

            console.log(`Create page for post: ${path}.`);

            const lang = (postNode.node.lang && postNode.node.lang.identifier) || siteLang;

            createPage({
                path: path,
                component: Template,
                context: {
                    slug: path,
                    isLocalized: postNode.node.isLocalized,
                    lang: lang,
                    post: postPayload,
                    earlier: earlierPostPayload,
                    later: laterPostPayload,
                    tableOfContents: postPayload.tableOfContents,
                    defaultLicense: defaultLicense,
                },
            });

            if (!postNode.node.isLocalized && postNode.node.lang) {
                let localizedPath = `/${postNode.node.lang}/${postNode.node.slug}`;

                console.log(`Create localized page for post: ${localizedPath}`);

                createPage({
                    path: localizedPath,
                    component: Template,
                    context: {
                        slug: localizedPath,
                        isLocalized: postNode.node.isLocalized,
                        lang: postNode.node.lang.identifier,
                        post: postPayload,
                        earlier: earlierPostPayload,
                        later: laterPostPayload,
                        tableOfContents: postPayload.tableOfContents,
                        defaultLicense: defaultLicense,
                    },
                });
            }
        })
    );
};
