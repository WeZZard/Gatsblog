const path = require('path');
const Template = path.resolve('src/templates/Page.js');

module.exports = async (args) => {
    const { createPagesArgs } = args;

    const { graphql, actions } = createPagesArgs;
    const { createPage } = actions;

    const result = await graphql(`
        {
            allPage(sort: { fields: [createdTime], order: DESC }) {
                edges {
                    node {
                        id
                        slug
                        lang
                        isLocalized
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
        pages.map( async pageNode => {
            const localeSlug = pageNode.node.isLocalized
                ? `/${pageNode.node.lang}`
                : '';

            const originalPath = [localeSlug, pageNode.node.slug].filter(_ => _).join('');

            let paths = [originalPath];

            if (!pageNode.node.isLocalized && pageNode.node.lang) {
                const localizedPath = `/${pageNode.node.lang}/${pageNode.node.slug}`;
                paths.push(localizedPath);
            }

            paths.forEach(path => {
                console.log(`Create page for page: ${path}.`);

                createPage({
                    path: path,
                    component: Template,
                    context: {
                        pageId: pageNode.node.id,
                    },
                });
            });
        })
    );
};
