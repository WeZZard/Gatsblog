const path = require('path');
const assert = require('assert');
const { makeMdxDocumentPayload } = require('../Payload');
const Template = path.resolve('src/templates/Page.js');

module.exports = async (args) => {
    const { createPagesArgs, siteLang } = args;

    const { graphql, actions } = createPagesArgs;
    const { createPage } = actions;

    const result = await graphql(`
        {
            allPage(sort: { fields: [createdTime], order: DESC }) {
                edges {
                    node {
                        title
                        subtitle
                        isPublished
                        createdTime
                        lastModifiedTime
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

    const { data: { allPage } } = result;

    const { edges: pages } = allPage || { edges: [] };

    pages.forEach( async (pageNode) => {
        const mdxDocument = await makeMdxDocumentPayload({
            id: pageNode.node.parent.id,
            graphql: graphql,
        });

        const pagePayload = {
            title: pageNode.node.title,
            subtitle: pageNode.node.subtitle,
            isPublished: pageNode.node.isPublished,
            createdTime: pageNode.node.createdTime,
            lastModifiedTime: pageNode.node.lastModifiedTime,
            slug: pageNode.node.slug,
            html: mdxDocument.html,
            code: mdxDocument.code,
            keywords: [],
            description: mdxDocument.excerpt,
        };

        const path = pageNode.node.slug;

        let localeLang = pageNode.node.lang || siteLang;

        assert(localeLang);

        let localizedPath = `${localeLang}/${pageNode.node.slug}`;

        console.log(`Create page for page: ${path}`);

        console.log(`Create page for localized page: ${path}`);

        createPage({
            path: path,
            component: Template,
            context: {
                isLocalized: false,
                lang: pageNode.node.lang,
                page: pagePayload,
            },
        });

        createPage({
            path: localizedPath,
            component: Template,
            context: {
                isLocalized: true,
                lang: pageNode.node.lang,
                page: pagePayload,
            },
        });
    });
};
