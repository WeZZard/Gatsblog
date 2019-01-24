module.exports = {
    location: 'Tag',
    itemComponentName : 'PostExcerpt',
    layoutComponentName: 'PostListLayout',
    getPageTitle: (tag, locale, pageIndex) => {
        return `Tag: ` + (pageIndex === 0
            ? `${tag.node.name}`
            : `${tag.node.name} (Page ${pageIndex})`)
    },
    getPagePath: (tag, locale, pageIndex) => {
        if (locale.node.identifier === 'none') {
            return pageIndex > 0
                ? `/${tag.node.slug}/${pageIndex}`
                : `/${tag.node.slug}`;
        } else {
            return `/${locale.node.slug}`
                + (pageIndex > 0
                    ? `/${tag.node.slug}/${pageIndex}`
                    : `/${tag.node.slug}`);
        }
    },
    getPreviousPageTitle: (locale) => {
        return 'Earlier Posts'
    },
    getNextPageTitle: (locale) => {
        return 'Later Posts'
    },
};
