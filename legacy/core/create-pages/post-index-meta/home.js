module.exports = {
  name: 'Home',
  getPageTitle: (locale, pageIndex) => {
    return pageIndex === 0 ? null : `All the Posts (Page ${pageIndex + 1})`;
  },
  getPagePath: (locale, pageIndex) => {
    const localeSlug = locale ? locale.slug : '';
    return [localeSlug, pageIndex > 0 ? `/page-${pageIndex + 1}` : ``]
      .filter(_ => _)
      .join('');
  },
  getPreviousPageTitle: () => {
    return 'Earlier Posts';
  },
  getNextPageTitle: () => {
    return 'Later Posts';
  },
};
