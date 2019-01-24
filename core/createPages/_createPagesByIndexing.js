const path = require('path');

const _IndexTemplate = path.resolve('src/templates/Index.js');

module.exports = async (args) => {
    const {
        graphql,
        createPage,
        locale,
        itemComponentName,
        layoutComponentName,
        primitiveItems,
        itemsPerPage,
        createItem,
        createPageTitle,
        createPagePath,
        showsPageTitle,
        previousPageTitle,
        nextPageTitle,
    } = args;

    const {
        data: {
            configYaml: {
                site: {
                    keywords: siteKeywords,
                    description: siteDescription
                },
            }
        }
    } = await graphql(`
        {
            configYaml {
              site {
                keywords
                description
              }
            }
        }
    `);

    const itemsCount = primitiveItems.length;

    const pagesOccupied = itemsCount % itemsPerPage === 0
        ? itemsCount / itemsPerPage
        : Math.floor(itemsCount / itemsPerPage) + 1;

    const pagesCount = Math.max(1, pagesOccupied);

    for (let pageIndex = 0; pageIndex < pagesCount; pageIndex++) {
        const start = pageIndex * itemsPerPage;
        const end = Math.min(start + itemsPerPage, itemsCount);

        const primitiveItemsInRange = primitiveItems.slice(start, end);

        const items = await Promise.all(primitiveItemsInRange.map(createItem));

        const pageTitle = createPageTitle(locale, pageIndex);

        const pagePath = createPagePath(locale, pageIndex);

        createPage({
            path: pagePath,
            component: _IndexTemplate,
            context: {
                locale: {
                    identifier: locale.node.identifier,
                    slug: locale.node.slug,
                },
                itemComponentName: itemComponentName,
                layoutComponentName: layoutComponentName,
                pageTitle: pageTitle,
                showsPageTitle: showsPageTitle,
                keywords: siteKeywords,
                description: siteDescription,
                items: items,
                paginationInfo: {
                    index: pageIndex,
                    pageCount: pagesCount,
                    previousPageTitle: previousPageTitle,
                    nextPageTitle: nextPageTitle,
                }
            },
        })
    }
};
