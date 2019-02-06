const {
    getDocumentType,
    getTitle,
    getCreatedTime,
} = require('./MDXShims');
const MDXRelativePathMetadata = require('./MDXRelativePathMetadata');

module.exports = function (args) {
    /*
    {
        documentType: string('Post', 'Page')
        documentIdentifier: string
        inlineFileLink: string
        title: string
        subtitle: string
        isIndex: bool
        isPublished: bool
        createdTime: string(ISO 8601)
        lastModifiedTime: string(ISO 8601)
        tags: [string]?
        category: string?
        lang: string?
        isLocalized: bool
        slug: string
    }
    */

    const { node, getNode } = args;

    if (node.internal.type === 'Mdx') {
        let metadata = {};

        const parentNode = getNode(node.parent);
        const sourceInstanceName = parentNode.sourceInstanceName;
        const relativePath = parentNode.relativePath;

        const createdTime = node.frontmatter.date ? new Date(node.frontmatter.date) : null;
        const lastModifiedTime = node.frontmatter.lastModifiedTime ? new Date(node.frontmatter.lastModifiedTime) : null;
        const birthTime = parentNode.birthTime ? new Date(parentNode.birthTime) : null;

        const relativePathMetadata = new MDXRelativePathMetadata(sourceInstanceName, relativePath);

        metadata.documentType = getDocumentType(sourceInstanceName);

        metadata.title = getTitle(node.frontmatter.title, relativePathMetadata.name);

        metadata.subtitle = node.frontmatter.subtitle || '';

        metadata.lang = relativePathMetadata.lang || node.frontmatter.lang || '';

        metadata.isLocalized = relativePathMetadata.isLocalized;

        metadata.isIndex = relativePathMetadata.isIndex;

        metadata.isPublished = node.frontmatter.isPublished || true;

        metadata.documentIdentifier = relativePathMetadata.documentIdentifier;

        if (metadata.documentType === 'Post') {
            metadata.tags = node.frontmatter.tags || [];

            metadata.category = node.frontmatter.category || "Uncategorized";
        }

        metadata.createdTime = getCreatedTime(createdTime, relativePathMetadata.createdTime, birthTime);

        metadata.lastModifiedTime = lastModifiedTime || metadata.createdTime;

        metadata.slug = relativePathMetadata.slug;

        metadata.relativePath = relativePath;

        metadata.inlineFileLink = relativePathMetadata.inlineFileLink;

        metadata.license = node.frontmatter.license || '';

        return metadata
    }

    return null;
};

