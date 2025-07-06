import {
  CreatePagesArgsExtended,
  LocaleNode,
  TaxonomyIndexPageMetadata,
} from '../../types/page-generation';

import createTaxonomyIndexPages from './_create-taxonomy-index-pages';

// Import legacy configuration functions (will be migrated later)
const { categories: meta }: { categories: TaxonomyIndexPageMetadata } = require('../../../legacy/core/create-pages/taxonomy-index-meta');
const { itemsPerPageForIndexPageName } = require('../../../legacy/core/config');

export default async function createPageOfCategories(
  args: CreatePagesArgsExtended
): Promise<void> {
  const {
    createPagesArgs,
    pendingSchemaData,
    indexingConfig,
    siteKeywords,
    siteDescription,
  } = args;

  const { graphql, actions } = createPagesArgs;
  const { createPage } = actions;
  const { locales, categories } = pendingSchemaData;

  // Preserve exact configuration filtering logic
  const config = indexingConfig.filter(
    config => config.name === 'Categories',
  )[0] || { isEnabled: true };

  // Preserve exact enabled check
  if (config.isEnabled) {
    const itemsPerPage = await itemsPerPageForIndexPageName(meta.name, graphql);

    // Preserve exact forEach loop structure (not map/Promise.all)
    locales.forEach((locale: LocaleNode | null) => {
      createTaxonomyIndexPages({
        type: 'category',
        createPage: createPage,
        siteKeywords,
        siteDescription,
        locale: locale,
        componentName: meta.componentName,
        taxonomies: categories.map(c => c.name).sort((c1, c2) => c1 > c2 ? 1 : -1),
        itemsPerPage,
        createPageTitle: meta.getPageTitle,
        createPagePath: meta.getPagePath,
        showsPageTitle: true,
        previousPageTitle: meta.getPreviousPageTitle(),
        nextPageTitle: meta.getNextPageTitle(),
      });
    });
  }
}