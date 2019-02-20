module.exports = {
  name: 'Categories',
  componentName: 'CategorySummary',
  getPageTitle: (locale, pageIndex) => {
    return pageIndex === 0
      ? `Categories`
      : `Categories (Page ${pageIndex + 1})`;
  },
  getPagePath: (locale, pageIndex) => {
    const localeSlug = locale ? locale.slug : '';
    return [
      localeSlug,
      `category`,
      pageIndex > 0 ? `/page-${pageIndex + 1}` : ``,
    ]
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
