import { getDocumentType, getTitle, getCreatedTime } from './mdx-shims';
import mdxRelativePathMetadata from './mdx-relative-path-metadata';

export interface MDXMetadataArgs {
  node: {
    internal: {
      type: string;
    };
    parent: string;
    frontmatter: {
      title?: string;
      date?: string;
      lang?: string;
      isPublished?: boolean | string;
    };
  };
  getNode: (id: string) => {
    sourceInstanceName: string;
    relativePath: string;
    birthTime?: string;
  };
}

export interface MDXMetadata {
  documentType: string | undefined;
  title: string;
  lang: string;
  isLocalized: boolean;
  isIndex: boolean;
  isPublished: boolean;
  createdTime: Date | undefined;
  slug: string;
  relativePath: string;
}

export default function mdxMetadata(args: MDXMetadataArgs): MDXMetadata | null {
  const { node, getNode } = args;

  if (node.internal.type === 'Mdx') {
    const parentNode = getNode(node.parent);
    const sourceInstanceName = parentNode.sourceInstanceName;
    const relativePath = parentNode.relativePath;

    const createdTime = node.frontmatter.date
      ? new Date(node.frontmatter.date)
      : null;

    const birthTime = parentNode.birthTime
      ? new Date(parentNode.birthTime)
      : null;

    const relativePathMetadata = mdxRelativePathMetadata(
      sourceInstanceName,
      relativePath,
    );

    const metadata: MDXMetadata = {
      documentType: getDocumentType(sourceInstanceName),
      title: getTitle(
        node.frontmatter.title,
        relativePathMetadata.name,
      ),
      lang: relativePathMetadata.lang || node.frontmatter.lang || '',
      isLocalized: relativePathMetadata.isLocalized,
      isIndex: relativePathMetadata.isIndex,
      isPublished:
        node.frontmatter.isPublished === undefined ||
        node.frontmatter.isPublished === true ||
        node.frontmatter.isPublished === 'true',
      createdTime: getCreatedTime(
        createdTime,
        'createdTime' in relativePathMetadata ? relativePathMetadata.createdTime : undefined,
        birthTime,
      ),
      slug: relativePathMetadata.slug,
      relativePath: relativePathMetadata.relativePath,
    };

    return metadata;
  }

  return null;
}