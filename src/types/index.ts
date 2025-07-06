// GraphQL types for blog content and metadata

export interface SiteMetadata {
  title: string;
  author: string;
  description: string;
  siteUrl: string;
  social: {
    github: string;
  };
}

export interface Site {
  siteMetadata: SiteMetadata;
}

export interface MdxHeading {
  value: string;
  depth: number;
}

export interface MdxCode {
  body: string;
  scope: Record<string, any>;
}

export interface MdxFrontmatter {
  title: string;
  subtitle?: string;
  isPublished: boolean;
  createdTime: string;
  lastModifiedTime?: string;
  license?: string;
  tags: string[];
  category: string;
  keywords?: string[];
  lang?: string;
}

export interface MdxNode {
  excerpt: string;
  code: MdxCode;
  headings: MdxHeading[];
  frontmatter: MdxFrontmatter;
}

export interface FileNode {
  childMdx: MdxNode;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  isPublished: boolean;
  createdTime: string;
  lastModifiedTime?: string;
  license?: string;
  tags: string[];
  category: string;
  keywords?: string[];
  lang?: string;
  file: FileNode;
}

export interface PostEdge {
  node: Post;
}

export interface AllPost {
  edges: PostEdge[];
}

export interface PaginationInfo {
  currentPage: number;
  pageCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPagePath?: string;
  previousPagePath?: string;
}

export interface PostQueryData {
  post: Post;
  earlierPostExcerpt?: Post;
  laterPostExcerpt?: Post;
}

export interface IndexQueryData {
  allPost: AllPost;
}

export interface IndexPageContext {
  slug: string;
  paginationInfo: PaginationInfo;
  title: string;
  subtitle?: string;
  showsPageTitle: boolean;
  description: string;
  keywords: string[];
  items: string[];
}

export interface PostPageContext {
  postId: string;
  earlierPostId?: string;
  laterPostId?: string;
}

export interface ComponentProps {
  children?: React.ReactNode;
  className?: string;
}

export interface MDXMetadataItem {
  name: string;
  data: any;
}

export interface MDXBodyProps {
  textStyle: string;
  code: MdxCode;
}

export interface MainProps {
  slug?: string;
  lang?: string;
  title?: string;
  description?: string;
  keywords?: string[];
  headings?: MdxHeading[];
  sections?: React.ReactNode;
  layout?: string;
}