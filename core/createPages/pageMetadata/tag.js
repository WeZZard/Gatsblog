module.exports = {
    location: 'Tag',
    itemComponentName : 'PostExcerpt',
    layoutComponentName: 'PostListLayout',
    getPageTitle: (tag, locale, pageIndex) => {
        return `Tag: ${tag.node.name}`
            + (pageIndex === 0 ? `` : ` (Page ${pageIndex})`)
    },
    getPagePath: (tag, locale, pageIndex) => {
        if (locale.node.identifier === 'none') {
            return `/${tag.node.slug}`
                + (pageIndex > 0 ? `/page-${pageIndex}` : `/`);
        } else {
            return `/${locale.node.slug}/${tag.node.slug}`
                + (pageIndex > 0 ? `/page-${pageIndex}` : ``);
        }
    },
    getPreviousPageTitle: (locale) => {
        return 'Earlier Posts'
    },
    getNextPageTitle: (locale) => {
        return 'Later Posts'
    },
};
