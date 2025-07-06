import {
  CreatePagesArgsExtended,
  LocaleNode,
  TaxonomyIndexPageMetadata,
} from '../../types/page-generation';

import createTaxonomyIndexPages from './_create-taxonomy-index-pages';

// Import legacy configuration functions (will be migrated later)
import { tags as meta } from '../metadata/taxonomy-index-meta';
import { itemsPerPageForIndexPageName } from '../config';

export default async function createPageOfTags(
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
  const { locales, tags } = pendingSchemaData;

  // Preserve exact configuration filtering logic
  const config = indexingConfig.filter(config => config.name === 'Tags')[0] || {
    isEnabled: true,
  };

  // Preserve exact enabled check
  if (config.isEnabled) {
    const itemsPerPage = await itemsPerPageForIndexPageName(meta.name, graphql);

    // Preserve exact forEach loop structure (not map/Promise.all)
    locales.forEach((locale: LocaleNode | null) => {
      createTaxonomyIndexPages({
        type: 'tag',
        createPage: createPage,
        siteKeywords,
        siteDescription,
        locale: locale,
        componentName: meta.componentName,
        taxonomies: tags.map(tag => tag.name).sort((t1, t2) => t1 > t2 ? 1 : -1),
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