module.exports = {
    location: 'Category',
    itemComponentName : 'PostExcerpt',
    layoutComponentName: 'PostListLayout',
    getPageTitle: (categoryName, locale, pageIndex) => {
        return pageIndex === 0
            ? `${categoryName}`
            : `${categoryName} (Page ${pageIndex})`
    },
    getPagePath: (categorySlug, locale, pageIndex) => {
        return pageIndex > 0 ? `${categorySlug}/${pageIndex}` : `${categorySlug}`;
    },
    getPreviousPageTitle: (locale) => {
        return 'Earlier Posts'
    },
    getNextPageTitle: (locale) => {
        return 'Later Posts'
    },
};
