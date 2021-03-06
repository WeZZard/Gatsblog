module.exports = {
  name: 'Category',
  getPageTitle: (category, locale, pageIndex) => {
    return pageIndex === 0
      ? `${category.name}`
      : `${category.name} (Page ${pageIndex + 1})`;
  },
  getPagePath: (category, locale, pageIndex) => {
    const localeSlug = locale ? locale.slug : '';
    return [
      localeSlug,
      category.slug,
      pageIndex > 0 ? `/page-${pageIndex + 1}` : ``,
    ]
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
