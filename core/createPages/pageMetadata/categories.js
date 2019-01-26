module.exports = {
    name: 'Categories',
    itemComponentName : 'CategorySummary',
    layoutComponentName: 'CategoryListLayout',
    getPageTitle: (locale, pageIndex) => {
        return pageIndex === 0
            ? `Categories`
            : `Categories (Page ${pageIndex})`
    },
    getPagePath: (locale, pageIndex) => {
        if (locale.identifier === 'none') {
            return `/category`
                + (pageIndex > 0 ? `/page-${pageIndex}` : ``)
        } else {
            return `/${locale.slug}/category`
                + (pageIndex > 0 ? `/page-${pageIndex}` : ``)
        }
    },
    getPreviousPageTitle: (locale) => {
        return 'Previous Page'
    },
    getNextPageTitle: (locale) => {
        return 'Next Page'
    },
};
