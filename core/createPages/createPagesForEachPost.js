const path = require('path');
const assert = require('assert');
const {
    makePostExcerptPayload,
    makeMdxDocumentPayload,
} = require('../Payload');
const {
    filterCategoryForPostNode,
    filterTagsForPostNode,
} = require('../Payload/utils');
const Template = path.resolve('src/templates/Post.js');

module.exports = async (args) => {
    const { createPagesArgs, pendingSchemaData, siteLang } = args;

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
                        tags
                        category
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

    posts.forEach( async (postNode, index) => {
        const postTags = filterTagsForPostNode(postNode, tags);

        const postCategory = filterCategoryForPostNode(postNode, categories);

        const mdxDocument = await makeMdxDocumentPayload({
            id: postNode.node.parent.id,
            graphql: graphql,
        });

        const postPayload = {
            title: postNode.node.title,
            subtitle: postNode.node.subtitle,
            isPublished: postNode.node.isPublished,
            createdTime: postNode.node.createdTime,
            lastModifiedTime: postNode.node.lastModifiedTime,
            tags: postTags,
            category: postCategory,
            slug: postNode.node.slug,
            tableOfContent: mdxDocument.tableOfContent,
            headings: mdxDocument.headings,
            html: mdxDocument.html,
            code: mdxDocument.code,
            keywords: [],
            description: mdxDocument.excerpt,
        };

        let earlierPostExcerpt = null;
        if (index - 1 >= 0) {
            const earlierPost = posts[index - 1];
            earlierPostExcerpt = await makePostExcerptPayload({
                post: earlierPost,
                tags,
                categories,
                graphql
            })
        }

        let laterPostExcerpt = null;
        if (index + 1 < posts.length) {
            const laterPost = posts[index + 1];
            laterPostExcerpt  = await makePostExcerptPayload({
                post: laterPost,
                tags,
                categories,
                graphql
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
    });
};
