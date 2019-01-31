const path = require('path');
const assert = require('assert');
const { makeMdxDocumentPayload } = require('../utils');
const Template = path.resolve('src/templates/Page.js');

module.exports = async (args) => {
    const {
        createPagesArgs,
        siteLang,
    } = args;

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

    const { data: { allPage } } = result;

    const { edges: pages } = allPage || { edges: [] };

    await Promise.all(
        pages.map( async (pageNode) => {
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

            let localeSlug = pageNode.node.isLocalized
                ? `/${pageNode.node.lang}`
                : '';

            let path = [localeSlug, pageNode.node.slug].filter(_ => _).join('');

            console.log(`Create page for page: ${path}`);

            const lang = (pageNode.node.lang && pageNode.node.lang.identifier) || siteLang;

            createPage({
                path: path,
                component: Template,
                context: {
                    isLocalized: pageNode.node.isLocalized,
                    lang: lang,
                    page: pagePayload,
                },
            });

            if (!pageNode.node.isLocalized && pageNode.node.lang) {
                let localizedPath = `/${pageNode.node.lang}/${pageNode.node.slug}`;

                console.log(`Create localized page for page: ${localizedPath}`);

                createPage({
                    path: localizedPath,
                    component: Template,
                    context: {
                        isLocalized: pageNode.node.isLocalized,
                        lang: pageNode.node.lang.identifier,
                        page: pagePayload,
                    },
                });
            }
        })
    );
};
