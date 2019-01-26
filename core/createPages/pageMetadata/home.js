module.exports = {
    name: 'Home',
    itemComponentName : 'PostExcerpt',
    layoutComponentName: 'PostListLayout',
    getPageTitle: (locale, pageIndex) => {
        return pageIndex === 0 ? null : `All Posts (Page ${pageIndex})`;
    },
    getPagePath: (locale, pageIndex) => {
        if (locale.identifier === 'none') {
            return '/' + (pageIndex > 0 ? `page-${pageIndex}` : ``);
        } else {
            return `/${locale.slug}`
                + (pageIndex > 0 ? `/page-${pageIndex}` : `/`);
        }
    },
    getPreviousPageTitle: (locale) => {
        return 'Earlier Posts'
    },
    getNextPageTitle: (locale) => {
        return 'Later Posts'
    },
};
