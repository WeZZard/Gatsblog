module.exports = {
    location: 'Tags',
    itemComponentName : 'TagSummary',
    layoutComponentName: 'TagListLayout',
    getPageTitle: (locale, pageIndex) => {
        return pageIndex === 0
            ? `Tags`
            : `Tags (Page ${pageIndex})`
    },
    getPagePath: (locale, pageIndex) => {
        if (locale.node.identifier === 'none') {
            return `/tags`
                + (pageIndex > 0 ? `/page-${pageIndex}` : ``)
        } else {
            return `/${locale.node.slug}/tags`
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
