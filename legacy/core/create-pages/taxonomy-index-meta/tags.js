module.exports = {
  name: 'Tags',
  componentName: 'TagSummary',
  getPageTitle: (locale, pageIndex) => {
    return pageIndex === 0 ? `Tags` : `Tags (Page ${pageIndex + 1})`;
  },
  getPagePath: (locale, pageIndex) => {
    const localeSlug = locale ? locale.slug : '';
    return [localeSlug, `/tag`, pageIndex > 0 ? `/page-${pageIndex + 1}` : ``]
      .filter(_ => _)
      .join('');
  },
  getPreviousPageTitle: () => {
    return 'Previous Page';
  },
  getNextPageTitle: () => {
    return 'Next Page';
  },
};
