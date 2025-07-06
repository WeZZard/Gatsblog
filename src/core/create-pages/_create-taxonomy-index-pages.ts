import path from 'path';
import debug from 'debug';
import {
  CreateTaxonomyIndexPagesArgs,
  TaxonomyIndexPageContext,
} from '../../types/page-generation';

export default function createTaxonomyIndexPages(args: CreateTaxonomyIndexPagesArgs): void {
  const {
    type,
    createPage,
    siteKeywords,
    siteDescription,
    locale,
    componentName,
    taxonomies,
    itemsPerPage,
    createPageTitle,
    createPagePath,
    showsPageTitle,
    previousPageTitle,
    nextPageTitle,
  } = args;

  const taxonomiesCount = taxonomies.length;

  // Preserve exact pagination calculation logic
  const pagesOccupied =
    taxonomiesCount % itemsPerPage === 0
      ? taxonomiesCount / itemsPerPage
      : Math.floor(taxonomiesCount / itemsPerPage) + 1;

  const pagesCount = Math.max(1, pagesOccupied);

  // Preserve exact for loop structure
  for (let pageIndex = 0; pageIndex < pagesCount; pageIndex++) {
    const start = pageIndex * itemsPerPage;
    const end = Math.min(start + itemsPerPage, taxonomiesCount);

    const taxonomiesInRange = taxonomies.slice(start, end);

    const pageTitle = createPageTitle(locale, pageIndex);
    const pagePath = createPagePath(locale, pageIndex) || '/';

    // Preserve exact debug statement
    debug(`create index page at: ${pagePath}`);

    const templatePath = `src/templates/Taxonomies.tsx`;

    // Preserve exact context structure
    const context: TaxonomyIndexPageContext = {
      type,
      slug: pagePath,
      locale,
      componentName,
      title: pageTitle,
      showsPageTitle,
      keywords: siteKeywords,
      description: siteDescription,
      taxonomies: taxonomiesInRange,
      paginationInfo: {
        basePath: createPagePath(locale, 0),
        pageIndex,
        pagesCount,
        previousPageTitle,
        nextPageTitle,
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