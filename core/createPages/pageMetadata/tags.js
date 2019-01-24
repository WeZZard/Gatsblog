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
        } else {
            return `/${locale.node.slug}/tags`
        }
    },
    getPreviousPageTitle: (locale) => {
        return 'Previous Page'
    },
    getNextPageTitle: (locale) => {
        return 'Next Page'
    },
};
