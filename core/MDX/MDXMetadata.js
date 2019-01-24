const {
    getDocumentType,
    getTitle,
    getCreatedTime
} = require('./MDXShims');
const MDXDocumentRelativePathMetadata = require('./MDXDocumentRelativePathMetadata');


module.exports = function (arg) {
    /*
    {
        documentType: string('Post', 'Page')
        documentIdentifier: string
        title: string
        isIndexPage: bool
        isDraft: bool
        createdTime: string(ISO 8601)
        lastModifiedTime: string(ISO 8601)
        tags: [string]
        category: string?
        localIdentifier: string?
        slug: string
    }
    */

    const { node, getNode } = arg;

    if (node.internal.type === 'Mdx') {
        let metadata = {};

        const parentNode = getNode(node.parent);
        const sourceInstanceName = parentNode.sourceInstanceName;
        const relativePath = parentNode.relativePath;

        metadata.documentType = getDocumentType(sourceInstanceName);

        const relativePathMetadata = new MDXDocumentRelativePathMetadata(sourceInstanceName, relativePath);

        metadata.documentIdentifier = relativePathMetadata.documentIdentifier;

        metadata.localIdentifier = relativePathMetadata.localeIdentifier;

        metadata.isIndex = relativePathMetadata.isIndex;

        metadata.isDraft = node.frontmatter.isDraft || false;

        metadata.tags = node.frontmatter.tags || [];

        metadata.title = getTitle(node.frontmatter.title, node.rawBody, relativePathMetadata.name);

        metadata.category = node.frontmatter.category || "Uncategorized";

        metadata.createdTime = getCreatedTime(node.frontmatter.date, relativePathMetadata.createdTime, parentNode.birthTime);

        metadata.lastModifiedTime = node.frontmatter.lastModifiedTime || metadata.createdTime;

        metadata.slug = relativePathMetadata.slug;

        return metadata
    }

    return null;
};

