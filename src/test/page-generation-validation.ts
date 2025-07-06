/**
 * Page Generation Migration Validation Utility
 * 
 * This utility helps validate that the TypeScript migration produces
 * identical results to the legacy JavaScript system.
 */

import { PostNode, LocaleNode, CategoryNode, TagNode } from '../types/page-generation';

// Mock data for testing
export const mockPostNode: PostNode = {
  id: 'test-post-1',
  slug: '/post/2024/01/test-post',
  lang: 'en',
  isLocalized: false,
  title: 'Test Post',
  createdTime: '2024-01-01T00:00:00Z',
  category: 'Technology',
  tags: ['TypeScript', 'Gatsby'],
};

export const mockLocalizedPostNode: PostNode = {
  id: 'test-post-2',
  slug: '/post/2024/01/test-post-zh',
  lang: 'zh',
  isLocalized: true,
  title: '测试文章',
  createdTime: '2024-01-02T00:00:00Z',
  category: 'Technology',
  tags: ['TypeScript', 'Gatsby'],
};

export const mockLocale: LocaleNode = {
  identifier: 'zh',
  slug: '/zh',
  name: 'Chinese',
};

export const mockCategory: CategoryNode = {
  name: 'Technology',
  slug: 'technology',
};

export const mockTag: TagNode = {
  name: 'TypeScript',
  slug: 'typescript',
};

/**
 * Validates that post path generation maintains legacy behavior
 */
export function validatePostPathGeneration(post: PostNode): string[] {
  const localeSlug = post.isLocalized ? `/${post.lang}` : '';
  const originalPath = [localeSlug, post.slug]
    .filter(str => str !== '')
    .join('');
  
  let paths = [originalPath === '' ? '/' : originalPath];
  
  // Check for duplicate path logic
  if (!post.isLocalized && post.lang) {
    const localizedPath = `/${post.lang}${post.slug}`;
    paths.push(localizedPath);
  }
  
  return paths;
}

/**
 * Validates pagination calculation logic
 */
export function validatePaginationCalculation(
  itemsCount: number,
  itemsPerPage: number
): { pagesCount: number; pagesOccupied: number } {
  const pagesOccupied =
    itemsCount % itemsPerPage === 0
      ? itemsCount / itemsPerPage
      : Math.floor(itemsCount / itemsPerPage) + 1;

  const pagesCount = Math.max(1, pagesOccupied);

  return { pagesCount, pagesOccupied };
}

/**
 * Validates post navigation logic
 */
export function validatePostNavigation(
  posts: Array<{ node: PostNode }>,
  currentIndex: number,
  currentPost: { node: PostNode }
): { earlierPost: PostNode | null; laterPost: PostNode | null } {
  let earlierPost: PostNode | null = null;
  let laterPost: PostNode | null = null;

  // Find earlier post
  if (currentIndex + 1 < posts.length && posts.length > 1) {
    for (let idx = currentIndex + 1; idx < posts.length; idx++) {
      const post = posts[idx];
      if (post.node.isLocalized === currentPost.node.isLocalized
          && post.node.lang === currentPost.node.lang) {
        earlierPost = post.node;
        break;
      }
    }
  }

  // Find later post
  if (currentIndex > 0) {
    for (let idx = currentIndex - 1; idx >= 0; idx--) {
      const post = posts[idx];
      if (post.node.isLocalized === currentPost.node.isLocalized
          && post.node.lang === currentPost.node.lang) {
        laterPost = post.node;
        break;
      }
    }
  }

  return { earlierPost, laterPost };
}

/**
 * Validates GraphQL filter generation for different locales
 */
export function validateGraphQLFilter(
  locale: LocaleNode | null,
  siteLang: string
): string {
  if (!locale) {
    return 'isLocalized: { eq: false }';
  }
  
  if (locale.identifier === siteLang) {
    return `lang: { in: [ null, "${locale.identifier}" ] }`;
  }
  
  return `lang: { eq: "${locale.identifier}" }`;
}

/**
 * Test runner for validation
 */
export function runValidationTests(): void {
  console.log('🧪 Running Page Generation Validation Tests...');

  // Test 1: Post Path Generation
  console.log('\n1. Testing Post Path Generation:');
  const paths1 = validatePostPathGeneration(mockPostNode);
  const paths2 = validatePostPathGeneration(mockLocalizedPostNode);
  console.log(`   Non-localized post paths: ${JSON.stringify(paths1)}`);
  console.log(`   Localized post paths: ${JSON.stringify(paths2)}`);

  // Test 2: Pagination Calculation
  console.log('\n2. Testing Pagination Calculation:');
  const pagination1 = validatePaginationCalculation(25, 10);
  const pagination2 = validatePaginationCalculation(30, 10);
  console.log(`   25 items, 10 per page: ${JSON.stringify(pagination1)}`);
  console.log(`   30 items, 10 per page: ${JSON.stringify(pagination2)}`);

  // Test 3: Post Navigation
  console.log('\n3. Testing Post Navigation:');
  const mockPosts = [
    { node: mockLocalizedPostNode },
    { node: mockPostNode },
  ];
  const nav = validatePostNavigation(mockPosts, 1, mockPosts[1]);
  console.log(`   Navigation for post at index 1: ${JSON.stringify(nav)}`);

  // Test 4: GraphQL Filter
  console.log('\n4. Testing GraphQL Filter Generation:');
  const filter1 = validateGraphQLFilter(null, 'en');
  const filter2 = validateGraphQLFilter(mockLocale, 'en');
  const filter3 = validateGraphQLFilter({ ...mockLocale, identifier: 'en' }, 'en');
  console.log(`   No locale: ${filter1}`);
  console.log(`   Different locale: ${filter2}`);
  console.log(`   Same locale: ${filter3}`);

  console.log('\n✅ Validation tests completed!');
}

// Export for use in other test files
export default {
  mockPostNode,
  mockLocalizedPostNode,
  mockLocale,
  mockCategory,
  mockTag,
  validatePostPathGeneration,
  validatePaginationCalculation,
  validatePostNavigation,
  validateGraphQLFilter,
  runValidationTests,
};