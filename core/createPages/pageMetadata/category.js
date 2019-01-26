module.exports = {
    name: 'Category',
    itemComponentName : 'PostExcerpt',
    layoutComponentName: 'PostListLayout',
    getPageTitle: (category, locale, pageIndex) => {
        return pageIndex === 0
            ? `${category.name}`
            : `${category.name} (Page ${pageIndex})`
    },
    getPagePath: (category, locale, pageIndex) => {
        if (locale.identifier === 'none') {
            return `/${category.slug}`
                + (pageIndex > 0 ? `/page-${pageIndex}` : ``);
        } else {
            return `/${locale.slug}/${category.slug}`
                + (pageIndex > 0 ? `/page-${pageIndex}` : ``);
        }
    },
    getPreviousPageTitle: (locale) => {
        return 'Earlier Posts'
    },
    getNextPageTitle: (locale) => {
        return 'Later Posts'
    },
};
