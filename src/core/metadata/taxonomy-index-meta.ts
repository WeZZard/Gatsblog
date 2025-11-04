interface LocaleInfo {
  slug: string;
}

interface TaxonomyIndexPageMetadata {
  name: string;
  componentName: string;
  getPageTitle: (locale: LocaleInfo | null, pageIndex: number) => string;
  getPagePath: (locale: LocaleInfo | null, pageIndex: number) => string;
  getPreviousPageTitle: () => string;
  getNextPageTitle: () => string;
}

const categories: TaxonomyIndexPageMetadata = {
  name: 'Categories',
  componentName: 'CategorySummary',
  getPageTitle: (locale: LocaleInfo | null, pageIndex: number) => {
    return pageIndex === 0
      ? 'Categories'
      : `Categories (Page ${pageIndex + 1})`;
  },
  getPagePath: (locale: LocaleInfo | null, pageIndex: number) => {
    const localeSlug = locale ? locale.slug : '';
    return [
      localeSlug,
      'category',
      pageIndex > 0 ? `/page-${pageIndex + 1}` : '',
    ]
      .filter(part => part)
      .join('');
  },
  getPreviousPageTitle: () => {
    return 'Previous Page';
  },
  getNextPageTitle: () => {
    return 'Next Page';
  },
};

const tags: TaxonomyIndexPageMetadata = {
  name: 'Tags',
  componentName: 'TagSummary',
  getPageTitle: (locale: LocaleInfo | null, pageIndex: number) => {
    return pageIndex === 0 ? 'Tags' : `Tags (Page ${pageIndex + 1})`;
  },
  getPagePath: (locale: LocaleInfo | null, pageIndex: number) => {
    const localeSlug = locale ? locale.slug : '';
    return [localeSlug, '/tag', pageIndex > 0 ? `/page-${pageIndex + 1}` : '']
      .filter(part => part)
      .join('');
  },
  getPreviousPageTitle: () => {
    return 'Previous Page';
  },
  getNextPageTitle: () => {
    return 'Next Page';
  },
};

export {
  categories,
  tags,
};

export type {
  TaxonomyIndexPageMetadata,
};