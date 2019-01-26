module.exports = {
    name: 'Tags',
    itemComponentName : 'TagSummary',
    layoutComponentName: 'TagListLayout',
    getPageTitle: (locale, pageIndex) => {
        return pageIndex === 0
            ? `Tags`
            : `Tags (Page ${pageIndex})`
    },
    getPagePath: (locale, pageIndex) => {
        if (locale.identifier === 'none') {
            return `/tag`
                + (pageIndex > 0 ? `/page-${pageIndex}` : ``)
        } else {
            return `/${locale.slug}/tag`
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
