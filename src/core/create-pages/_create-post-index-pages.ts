import path from 'path';
import debug from 'debug';
import {
  CreatePostIndexPagesArgs,
  LocaleNode,
  IndexPageContext,
} from '../../types/page-generation';

export default function createPostIndexPages(args: CreatePostIndexPagesArgs): void {
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

  // Preserve exact pagination calculation logic
  const pagesOccupied =
    itemsCount % itemsPerPage === 0
      ? itemsCount / itemsPerPage
      : Math.floor(itemsCount / itemsPerPage) + 1;

  const pagesCount = Math.max(1, pagesOccupied);

  // Preserve exact for loop structure
  for (let pageIndex = 0; pageIndex < pagesCount; pageIndex++) {
    const start = pageIndex * itemsPerPage;
    const end = Math.min(start + itemsPerPage, itemsCount);

    const itemsInRange = items.slice(start, end);

    const pageTitle = createPageTitle(locale, pageIndex);
    const pagePath = createPagePath(locale, pageIndex) || '/';

    // Preserve exact debug statement
    debug(`create index page at: ${pagePath}`);

    const templatePath = `src/templates/Index.tsx`;

    // Preserve exact context structure and calculations
    const context: IndexPageContext = {
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
        // Additional pagination info for compatibility
        currentPage: pageIndex + 1,
        pageCount: pagesCount,
        hasNextPage: pageIndex < pagesCount - 1,
        hasPreviousPage: pageIndex > 0,
        nextPagePath: pageIndex < pagesCount - 1 ? createPagePath(locale, pageIndex + 1) : undefined,
        previousPagePath: pageIndex > 0 ? createPagePath(locale, pageIndex - 1) : undefined,
      },
    };

    // Preserve exact createPage function call
    createPage({
      path: pagePath,
      component: path.resolve(templatePath),
      context: context,
    });
  }
}