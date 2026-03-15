const path = require('path');
const debug = require('debug');

const Template = path.resolve('src/templates/Page.js');

module.exports = async args => {
  const { createPagesArgs } = args;

  const { graphql, actions } = createPagesArgs;
  const { createPage } = actions;

  const result = await graphql(`
    {
      allPage(sort: { createdTime: DESC }) {
        edges {
          node {
            id
            slug
            lang
            isLocalized
            contentFilePath
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors;
  }

  const {
    data: { allPage },
  } = result;

  const { edges: pages } = allPage || { edges: [] };

  await Promise.all(
    pages.map(async pageNode => {
      const localeSlug = pageNode.node.isLocalized
        ? `/${pageNode.node.lang}`
        : '';

      const originalPath = [localeSlug, pageNode.node.slug]
        .filter(_ => _)
        .join('');

      let paths = [originalPath];

      if (!pageNode.node.isLocalized && pageNode.node.lang) {
        const localizedPath = `/${pageNode.node.lang}/${pageNode.node.slug}`;
        paths.push(localizedPath);
      }

      paths.forEach(path => {
        debug(`Create page for page: ${path}.`);

        const contentFilePath = pageNode.node.contentFilePath;
        const component = contentFilePath
          ? `${Template}?__contentFilePath=${contentFilePath}`
          : Template;

        createPage({
          path: path,
          component: component,
          context: {
            pageId: pageNode.node.id,
          },
        });
      });
    }),
  );
};
