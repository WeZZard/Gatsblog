const path = require('path');
const assert = require('assert');
const { makePostPayload } = require('../Payload');
const Template = path.resolve('src/templates/Post.js');

module.exports = async (args) => {
    const {
        createPagesArgs,
        pendingSchemaData,
        siteLang,
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
                        slug
                        lang
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

            let earlierPostExcerpt = null;
            if (index - 1 >= 0) {
                const earlierPost = posts[index - 1];
                earlierPostExcerpt = await makePostPayload({
                    post: earlierPost,
                    tags,
                    categories,
                    graphql,
                    style: 'Excerpt',
                })
            }

            let laterPostExcerpt = null;
            if (index + 1 < posts.length) {
                const laterPost = posts[index + 1];
                laterPostExcerpt  = await makePostPayload({
                    post: laterPost,
                    tags,
                    categories,
                    graphql,
                    style: 'Excerpt',
                })
            }

            let path = postNode.node.slug;

            let localeLang = postNode.node.lang || siteLang;

            assert(localeLang);

            let localizedPath = `${localeLang}/${postNode.node.slug}`;

            console.log(`Create page for post: ${path}`);

            console.log(`Create localized page for post: ${localizedPath}`);

            createPage({
                path: path,
                component: Template,
                context: {
                    isLocalized: false,
                    lang: postNode.node.lang,
                    post: postPayload,
                    earlier: earlierPostExcerpt,
                    later: laterPostExcerpt,
                },
            });

            createPage({
                path: localizedPath,
                component: Template,
                context: {
                    isLocalized: true,
                    lang: postNode.node.lang,
                    post: postPayload,
                    earlier: earlierPostExcerpt,
                    later: laterPostExcerpt,
                },
            });
        })
    );
};
