module.exports = {
    name: 'Tag',
    itemComponentName : 'PostExcerpt',
    layoutComponentName: 'PostListLayout',
    getPageTitle: (tag, locale, pageIndex) => {
        return `Tag: ${tag.name}`
            + (pageIndex === 0 ? `` : ` (Page ${pageIndex})`)
    },
    getPagePath: (tag, locale, pageIndex) => {
        if (locale.identifier === 'none') {
            return `/${tag.slug}`
                + (pageIndex > 0 ? `/page-${pageIndex}` : ``);
        } else {
            return `/${locale.slug}/${tag.slug}`
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
