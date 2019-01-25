module.exports = {
    location: 'Category',
    itemComponentName : 'PostExcerpt',
    layoutComponentName: 'PostListLayout',
    getPageTitle: (category, locale, pageIndex) => {
        return pageIndex === 0
            ? `${category.node.name}`
            : `${category.node.name} (Page ${pageIndex})`
    },
    getPagePath: (category, locale, pageIndex) => {
        if (locale.node.identifier === 'none') {
            return `/${category.node.slug}`
                + (pageIndex > 0 ? `/page-${pageIndex}` : ``);
        } else {
            return `/${locale.node.slug}/${category.node.slug}`
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
