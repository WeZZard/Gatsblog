const path = require('path');
const debug = require('debug');

module.exports = args => {
  const {
    type,
    createPage,
    siteKeywords,
    siteDescription,
    locale,
    componentName,
    taxonomies,
    itemsPerPage,
    createPageTitle,
    createPagePath,
    showsPageTitle,
    previousPageTitle,
    nextPageTitle,
  } = args;

  const taxonomiesCount = taxonomies.length;

  const pagesOccupied =
    taxonomiesCount % itemsPerPage === 0
      ? taxonomiesCount / itemsPerPage
      : Math.floor(taxonomiesCount / itemsPerPage) + 1;

  const pagesCount = Math.max(1, pagesOccupied);

  for (let pageIndex = 0; pageIndex < pagesCount; pageIndex++) {
    const start = pageIndex * itemsPerPage;
    const end = Math.min(start + itemsPerPage, taxonomiesCount);

    const taxonomiesInRange = taxonomies.slice(start, end);

    const pageTitle = createPageTitle(locale, pageIndex);

    const pagePath = createPagePath(locale, pageIndex) || '/';

    debug(`create index page at: ${pagePath}`);

    const templatePath = `src/templates/Taxonomies.js`;

    createPage({
      path: pagePath,
      component: path.resolve(templatePath),
      context: {
        type,
        slug: pagePath,
        locale,
        componentName,
        title: pageTitle,
        showsPageTitle,
        keywords: siteKeywords,
        description: siteDescription,
        taxonomies: taxonomiesInRange,
        paginationInfo: {
          basePath: createPagePath(locale, 0),
          pageIndex,
          pagesCount,
          previousPageTitle,
          nextPageTitle,
        },
      },
    });
  }
};
