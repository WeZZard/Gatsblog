module.exports = {
    name: 'Home',
    itemComponentName : 'PostExcerpt',
    layoutComponentName: 'PostListLayout',
    getPageTitle: (locale, pageIndex) => {
        return pageIndex === 0 ? null : `All Posts (Page ${pageIndex})`;
    },
    getPagePath: (locale, pageIndex) => {
        const localeSlug = locale ? locale.slug : '';
        return [
            localeSlug,
            pageIndex > 0 ? `page-${pageIndex}` : ``,
        ].filter(_ => _).join('/') || '/';
    },
    getPreviousPageTitle: (locale) => {
        return 'Earlier Posts'
    },
    getNextPageTitle: (locale) => {
        return 'Later Posts'
    },
};
