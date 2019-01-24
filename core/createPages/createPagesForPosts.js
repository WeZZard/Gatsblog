const path = require('path');

const PostTemplate = path.resolve('src/templates/Post.js');
const PageTemplate = path.resolve('src/templates/Page.js');

module.exports = async (arg) => {
    const { graphql, actions } = arg;
    const { createPage } = actions;

    const {
        data: {
            allMarkdownRemark: { edges: documents },
        },
    } = await graphql(`
        {
            allMarkdownRemark(
                sort: { fields: [fields___birthTime], order: DESC }
            ) {
                edges {
                    node {
                        fields {
                            slug
                            category
                            tags
                            birthTime
                            title
                            documentType
                        }
                        tableOfContents
                        html
                    }
                }
            }
        }
    `);

    const getTemplate = (documentType) => {
        switch (documentType) {
            case "Post":
                return PostTemplate;
            case "Page":
                return PageTemplate;
            default:
                throw `Unexpected document type "${documentType}".`;
        }
    };

    documents.forEach((document, index) => {
        const previous =
            index === documents.length - 1 ? null : documents[index + 1].node;
        const next = index === 0 ? null : documents[index - 1].node;

        createPage({
            path: document.node.fields.slug,
            component: getTemplate(document.node.fields.documentType),
            context: {
                document: document,
                previous,
                next,
            },
        })
    })
};