module.exports = {
    location: 'Tag',
    itemComponentName : 'PostExcerpt',
    layoutComponentName: 'PostListLayout',
    getPageTitle: (tagName, locale, pageIndex) => {
        return `Tag: ` + (pageIndex === 0 ? `${tagName}` : `${tagName} (Page ${pageIndex})`)
    },
    getPagePath: (tagSlug, locale, pageIndex) => {
        return pageIndex > 0 ? `${tagSlug}/${pageIndex}` : `${tagSlug}`;
    },
    getPreviousPageTitle: (locale) => {
        return 'Earlier Posts'
    },
    getNextPageTitle: (locale) => {
        return 'Later Posts'
    },
};
