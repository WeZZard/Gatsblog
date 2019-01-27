const {
    getDocumentType,
    getTitle,
    getSubtitle,
    getCreatedTime
} = require('./MDXShims');
const MDXRelativePathMetadata = require('./MDXRelativePathMetadata');

module.exports = function (args) {
    /*
    {
        documentType: string('Post', 'Page')
        documentIdentifier: string
        title: string
        subtitle: string
        isIndex: bool
        isPublished: bool
        createdTime: string(ISO 8601)
        lastModifiedTime: string(ISO 8601)
        tags: [string]
        category: string?
        locale: string?
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

        metadata.documentType = getDocumentType(sourceInstanceName);

        const relativePathMetadata = new MDXRelativePathMetadata(sourceInstanceName, relativePath);

        metadata.documentIdentifier = relativePathMetadata.documentIdentifier;

        metadata.locale = relativePathMetadata.locale;

        metadata.isIndex = relativePathMetadata.isIndex;

        metadata.isPublished = node.frontmatter.isPublished || true;

        metadata.tags = node.frontmatter.tags || [];

        metadata.title = getTitle(node.frontmatter.title, node.rawBody, relativePathMetadata.name);

        metadata.subtitle = getSubtitle(node.frontmatter.subtitle, node.rawBody);

        metadata.category = node.frontmatter.category || "Uncategorized";

        metadata.createdTime = getCreatedTime(createdTime, relativePathMetadata.createdTime, birthTime);

        metadata.lastModifiedTime = lastModifiedTime || metadata.createdTime;

        metadata.slug = relativePathMetadata.slug;

        return metadata
    }

    return null;
};

