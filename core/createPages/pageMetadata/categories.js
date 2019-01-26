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
        return [
            `${locale.slug}`,
            `category`,
            pageIndex > 0 ? `page-${pageIndex}` : ``,
        ].filter(_ => _).join('/');
    },
    getPreviousPageTitle: (locale) => {
        return 'Previous Page'
    },
    getNextPageTitle: (locale) => {
        return 'Next Page'
    },
};
