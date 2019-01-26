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
        return [
            `${locale.slug}`,
            `${category.slug}`,
            pageIndex > 0 ? `page-${pageIndex}` : ``,
        ].filter(_ => _).join('/');
    },
    getPreviousPageTitle: (locale) => {
        return 'Earlier Posts'
    },
    getNextPageTitle: (locale) => {
        return 'Later Posts'
    },
};
