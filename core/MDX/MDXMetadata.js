const { getDocumentType, getTitle, getCreatedTime } = require('./MDXShims');
const MDXRelativePathMetadata = require('./MDXRelativePathMetadata');

module.exports = function(args) {
  /*
    {
        documentType: string('Post', 'Page')
        inlineFileLink: string
        title: string
        isIndex: bool
        isPublished: bool
        createdTime: Date(string(ISO 8601))
        slug: string
    }
    */

  const { node, getNode } = args;

  if (node.internal.type === 'Mdx') {
    let metadata = {};

    const parentNode = getNode(node.parent);
    const sourceInstanceName = parentNode.sourceInstanceName;
    const relativePath = parentNode.relativePath;

    const createdTime = node.frontmatter.date
      ? new Date(node.frontmatter.date)
      : null;

    const birthTime = parentNode.birthTime
      ? new Date(parentNode.birthTime)
      : null;

    const relativePathMetadata = new MDXRelativePathMetadata(
      sourceInstanceName,
      relativePath,
    );

    metadata.documentType = getDocumentType(sourceInstanceName);

    metadata.title = getTitle(
      node.frontmatter.title,
      relativePathMetadata.name,
    );

    metadata.lang = relativePathMetadata.lang || node.frontmatter.lang || '';

    metadata.isLocalized = relativePathMetadata.isLocalized;

    metadata.isIndex = relativePathMetadata.isIndex;

    metadata.isPublished =
      node.frontmatter.isPublished === undefined ||
      node.frontmatter.isPublished === 'true';

    metadata.createdTime = getCreatedTime(
      createdTime,
      relativePathMetadata.createdTime,
      birthTime,
    );

    metadata.slug = relativePathMetadata.slug;

    metadata.inlineFileLink = relativePathMetadata.inlineFileLink;

    return metadata;
  }

  return null;
};
