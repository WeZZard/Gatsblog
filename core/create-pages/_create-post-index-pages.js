const path = require('path');

module.exports = (args) => {
    const {
        createPage,
        siteKeywords,
        siteDescription,
        locale,
        items,
        itemsPerPage,
        createPageTitle,
        createPagePath,
        showsPageTitle,
        previousPageTitle,
        nextPageTitle,
    } = args;

    const itemsCount = items.length;

    const pagesOccupied = itemsCount % itemsPerPage === 0
        ? itemsCount / itemsPerPage
        : Math.floor(itemsCount / itemsPerPage) + 1;

    const pagesCount = Math.max(1, pagesOccupied);

    for (let pageIndex = 0; pageIndex < pagesCount; pageIndex++) {
        const start = pageIndex * itemsPerPage;
        const end = Math.min(start + itemsPerPage, itemsCount);

        const itemsInRange = items.slice(start, end);

        const pageTitle = createPageTitle(locale, pageIndex);

        const pagePath = createPagePath(locale, pageIndex) || '/';

        console.log(`create index page at: ${pagePath}`);

        const templatePath = `src/templates/Index.js`;

        createPage({
            path: pagePath,
            component: path.resolve(templatePath),
            context: {
                slug: pagePath,
                locale,
                title: pageTitle,
                showsPageTitle,
                keywords: siteKeywords,
                description: siteDescription,
                items: itemsInRange,
                paginationInfo: {
                    basePath: createPagePath(locale, 0),
                    pageIndex,
                    pagesCount,
                    previousPageTitle,
                    nextPageTitle,
                }
            },
        })
    }
};
