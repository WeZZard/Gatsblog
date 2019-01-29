module.exports = {
    name: 'Tag',
    itemComponentName : 'PostExcerpt',
    layoutComponentName: 'PostListLayout',
    getPageTitle: (tag, locale, pageIndex) => {
        return `Tag: ${tag.name}`
            + (pageIndex === 0 ? `` : ` (Page ${pageIndex + 1})`)
    },
    getPagePath: (tag, locale, pageIndex) => {
        const localeSlug = locale ? locale.slug : '';
        return [
            localeSlug,
            tag.slug,
            pageIndex > 0 ? `/page-${pageIndex + 1}` : ``,
        ].filter(_ => _).join();
    },
    getPreviousPageTitle: (locale) => {
        return 'Earlier Posts'
    },
    getNextPageTitle: (locale) => {
        return 'Later Posts'
    },
};
