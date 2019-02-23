const MDXMetadata = require('../../MDXMetadata');
const { makeDisambiguateIdentifier: _ } = require('../../MDXShims');

test('MDXMetadata returns null when node.internal.type is not Mdx', () => {
  const args = {
    node: {
      internal: {
        type: 'File',
      },
    },
  };

  expect(MDXMetadata(args)).toBeNull();
});

// MARK: Post

test('MDXMetadata creates metadata of Post', () => {
  const parentNode = {
    internal: {
      type: 'File',
    },
    sourceInstanceName: 'Post',
    relativePath: '2019-01-01-Post-Title.md',
    birthTime: '2019-01-01',
  };

  const node = {
    internal: {
      type: 'Mdx',
    },
    frontmatter: {
      title: 'Post Title',
      subtitle: 'Post Subtitle',
      isPublished: 'true',
      tags: ['Tag1', 'Tag2', 'Tag3'],
      category: 'Category1',
      date: '2019-01-02',
      lastModifiedTime: '2019-01-03',
    },
    parent: {
      id: 'parentNode',
    },
    rawBody: '',
  };

  const args = {
    node: node,
    getNode: node => {
      return node.id === 'parentNode' ? parentNode : null;
    },
  };

  const result = {
    createdTime: new Date('2019-01-02T00:00:00.000Z'),
    documentType: 'Post',
    title: 'Post Title',
    isIndex: false,
    isPublished: true,
    lang: '',
    isLocalized: false,
    slug: `/post/2019/01/post-title-${_('2019-01-01-Post-Title')}`,
    relativePath: '2019-01-01-Post-Title.md',
  };

  expect(MDXMetadata(args)).toEqual(result);
});

test('MDXMetadata creates metadata of localized Post', () => {
  const parentNode = {
    internal: {
      type: 'File',
    },
    sourceInstanceName: 'Post',
    relativePath: '2019-01-01-Post-Title/en-US/index.md',
    birthTime: '2019-01-01',
  };

  const node = {
    internal: {
      type: 'Mdx',
    },
    frontmatter: {
      title: 'Post Title',
      subtitle: 'Post Subtitle',
      isPublished: 'true',
      tags: ['Tag1', 'Tag2', 'Tag3'],
      category: 'Category1',
      lastModifiedTime: '2019-01-02',
    },
    parent: {
      id: 'parentNode',
    },
    rawBody: '',
  };

  const args = {
    node: node,
    getNode: node => {
      return node.id === 'parentNode' ? parentNode : null;
    },
  };

  const result = {
    documentType: 'Post',
    title: 'Post Title',
    isIndex: true,
    isPublished: true,
    createdTime: new Date('2019-01-01'),
    lang: 'en-US',
    isLocalized: true,
    slug: `/post/2019/01/post-title-${_('2019-01-01-Post-Title')}`,
    relativePath: 'index.md',
  };

  expect(MDXMetadata(args)).toEqual(result);
});

// MARK: Page

test('MDXMetadata creates metadata of Page', () => {
  const parentNode = {
    internal: {
      type: 'File',
    },
    sourceInstanceName: 'Page',
    relativePath: 'Page-Title.md',
    birthTime: '2019-01-01',
  };

  const node = {
    internal: {
      type: 'Mdx',
    },
    frontmatter: {
      title: 'Page Title',
      subtitle: 'Page Subtitle',
      isPublished: 'true',
      lastModifiedTime: '2019-01-02',
    },
    parent: {
      id: 'parentNode',
    },
    rawBody: '',
  };

  const args = {
    node: node,
    getNode: node => {
      return node.id === 'parentNode' ? parentNode : null;
    },
  };

  const result = {
    documentType: 'Page',
    title: 'Page Title',
    isIndex: false,
    isPublished: true,
    createdTime: new Date('2019-01-01'),
    lang: '',
    isLocalized: false,
    slug: '/page-title',
    relativePath: 'Page-Title.md',
  };

  expect(MDXMetadata(args)).toEqual(result);
});

test('MDXMetadata creates metadata of localized Page', () => {
  const parentNode = {
    internal: {
      type: 'File',
    },
    sourceInstanceName: 'Page',
    relativePath: 'Page-Title/en-US/index.md',
    birthTime: '2019-01-01',
  };

  const node = {
    internal: {
      type: 'Mdx',
    },
    frontmatter: {
      title: 'Page Title',
      subtitle: 'Page Subtitle',
      isPublished: 'true',
      lastModifiedTime: '2019-01-02',
    },
    parent: {
      id: 'parentNode',
    },
    rawBody: '',
  };

  const args = {
    node: node,
    getNode: node => {
      return node.id === 'parentNode' ? parentNode : null;
    },
  };

  const result = {
    documentType: 'Page',
    title: 'Page Title',
    isIndex: true,
    isPublished: true,
    createdTime: new Date('2019-01-01'),
    lang: 'en-US',
    isLocalized: true,
    slug: '/page-title',
    relativePath: 'index.md',
  };

  expect(MDXMetadata(args)).toEqual(result);
});

test('MDXMetadata creates metadata of Page with tags omitted', () => {
  const parentNode = {
    internal: {
      type: 'File',
    },
    sourceInstanceName: 'Page',
    relativePath: 'Page-Title.md',
    birthTime: '2019-01-01',
  };

  const node = {
    internal: {
      type: 'Mdx',
    },
    frontmatter: {
      title: 'Page Title',
      subtitle: 'Page Subtitle',
      isPublished: 'true',
      tags: ['Tag1', 'Tag2', 'Tag3'],
      lastModifiedTime: '2019-01-02',
    },
    parent: {
      id: 'parentNode',
    },
    rawBody: '',
  };

  const args = {
    node: node,
    getNode: node => {
      return node.id === 'parentNode' ? parentNode : null;
    },
  };

  const result = {
    documentType: 'Page',
    title: 'Page Title',
    isIndex: false,
    isPublished: true,
    createdTime: new Date('2019-01-01'),
    lang: '',
    isLocalized: false,
    slug: '/page-title',
    relativePath: 'Page-Title.md',
  };

  expect(MDXMetadata(args)).toEqual(result);
});

test('MDXMetadata creates metadata of Page with category omitted', () => {
  const parentNode = {
    internal: {
      type: 'File',
    },
    sourceInstanceName: 'Page',
    relativePath: 'Page-Title.md',
    birthTime: '2019-01-01',
  };

  const node = {
    internal: {
      type: 'Mdx',
    },
    frontmatter: {
      title: 'Page Title',
      subtitle: 'Page Subtitle',
      isPublished: 'true',
      category: 'Category1',
      lastModifiedTime: '2019-01-02',
    },
    parent: {
      id: 'parentNode',
    },
    rawBody: '',
  };

  const args = {
    node: node,
    getNode: node => {
      return node.id === 'parentNode' ? parentNode : null;
    },
  };

  const result = {
    documentType: 'Page',
    title: 'Page Title',
    isIndex: false,
    isPublished: true,
    createdTime: new Date('2019-01-01'),
    lang: '',
    isLocalized: false,
    slug: '/page-title',
    relativePath: 'Page-Title.md',
  };

  expect(MDXMetadata(args)).toEqual(result);
});
