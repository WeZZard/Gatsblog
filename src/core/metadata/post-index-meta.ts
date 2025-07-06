interface LocaleInfo {
  slug: string;
}

interface PageMetadata {
  name: string;
  getPageTitle: (locale: LocaleInfo | null, pageIndex: number) => string | null;
  getPagePath: (locale: LocaleInfo | null, pageIndex: number) => string;
  getPreviousPageTitle: (locale: LocaleInfo | null) => string;
  getNextPageTitle: (locale: LocaleInfo | null) => string;
}

interface TagPageMetadata {
  name: string;
  getPageTitle: (tag: any, locale: LocaleInfo | null, pageIndex: number) => string | null;
  getPagePath: (tag: any, locale: LocaleInfo | null, pageIndex: number) => string;
  getPreviousPageTitle: (locale: LocaleInfo | null) => string;
  getNextPageTitle: (locale: LocaleInfo | null) => string;
}

interface CategoryPageMetadata {
  name: string;
  getPageTitle: (category: any, locale: LocaleInfo | null, pageIndex: number) => string | null;
  getPagePath: (category: any, locale: LocaleInfo | null, pageIndex: number) => string;
  getPreviousPageTitle: (locale: LocaleInfo | null) => string;
  getNextPageTitle: (locale: LocaleInfo | null) => string;
}

const home: PageMetadata = {
  name: 'Home',
  getPageTitle: (locale: LocaleInfo | null, pageIndex: number) => {
    return pageIndex === 0 ? null : `All the Posts (Page ${pageIndex + 1})`;
  },
  getPagePath: (locale: LocaleInfo | null, pageIndex: number) => {
    const localeSlug = locale ? locale.slug : '';
    return [localeSlug, pageIndex > 0 ? `/page-${pageIndex + 1}` : '']
      .filter(part => part)
      .join('');
  },
  getPreviousPageTitle: (locale: LocaleInfo | null) => {
    return 'Earlier Posts';
  },
  getNextPageTitle: (locale: LocaleInfo | null) => {
    return 'Later Posts';
  },
};

const tag: TagPageMetadata = {
  name: 'Tag',
  getPageTitle: (tag: any, locale: LocaleInfo | null, pageIndex: number) => {
    return `Tags > ${tag.name}` + (pageIndex === 0 ? '' : ` (Page ${pageIndex + 1})`);
  },
  getPagePath: (tag: any, locale: LocaleInfo | null, pageIndex: number) => {
    const localeSlug = locale ? locale.slug : '';
    return [localeSlug, tag.slug, pageIndex > 0 ? `/page-${pageIndex + 1}` : '']
      .filter(part => part)
      .join('');
  },
  getPreviousPageTitle: (locale: LocaleInfo | null) => {
    return 'Earlier Posts';
  },
  getNextPageTitle: (locale: LocaleInfo | null) => {
    return 'Later Posts';
  },
};

const category: CategoryPageMetadata = {
  name: 'Category',
  getPageTitle: (category: any, locale: LocaleInfo | null, pageIndex: number) => {
    return pageIndex === 0
      ? category.name
      : `${category.name} (Page ${pageIndex + 1})`;
  },
  getPagePath: (category: any, locale: LocaleInfo | null, pageIndex: number) => {
    const localeSlug = locale ? locale.slug : '';
    return [
      localeSlug,
      category.slug,
      pageIndex > 0 ? `/page-${pageIndex + 1}` : '',
    ]
      .filter(part => part)
      .join('');
  },
  getPreviousPageTitle: (locale: LocaleInfo | null) => {
    return 'Earlier Posts';
  },
  getNextPageTitle: (locale: LocaleInfo | null) => {
    return 'Later Posts';
  },
};

export {
  home,
  tag,
  category,
};

export type {
  PageMetadata,
  TagPageMetadata,
  CategoryPageMetadata,
};