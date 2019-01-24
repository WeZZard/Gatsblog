module.exports = {
    location: 'Home',
    itemComponentName : 'PostExcerpt',
    layoutComponentName: 'PostListLayout',
    getPageTitle: (locale, pageIndex) => {
        return pageIndex === 0 ? null : `All Posts (Page ${pageIndex})`;
    },
    getPagePath: (locale, pageIndex) => {
        return pageIndex > 0 ? `/${pageIndex}` : `/`;
    },
    getPreviousPageTitle: (locale) => {
        return 'Earlier Posts'
    },
    getNextPageTitle: (locale) => {
        return 'Later Posts'
    },
};
