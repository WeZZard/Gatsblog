const assert = require('assert');

const _getHomePageTitle = (pageIndex) => {
    return pageIndex === 0 ? null : `All Posts (Page ${pageIndex})`;
};

const _getHomePagePath = (pageIndex) => {
    return pageIndex > 0 ? `/${pageIndex}` : `/`;
};

const _getCategoryPageTitle = (categoryName, pageIndex) => {
    return pageIndex === 0
        ? `${categoryName}`
        : `${categoryName} (Page ${pageIndex})`
};

const _getCategoryPagePath = (categorySlug, pageIndex) => {
    return pageIndex > 0 ? `${categorySlug}/${pageIndex}` : `${categorySlug}`;
};

const _getTagPageTitle = (tagName, pageIndex) => {
    return `Tag: ` + (pageIndex === 0 ? `${tagName}` : `${tagName} (Page ${pageIndex})`)
};

const _getTagPagePath = (tagSlug, pageIndex) => {
    return pageIndex > 0 ? `${tagSlug}/${pageIndex}` : `${tagSlug}`;
};

const _makeTagById = async (nodeId, graphql) => {
    const {
        data: {
            allTag: { edges: tags },
        },
    } = await graphql(`
        {
            allTag( filter: { id: {eq: "${nodeId}" } } ) {
                edges {
                    node {
                        name
                        slug
                    }
                }
            }
        }
    `);

    if (tags.length === 0) {
        throw `No tag found for tag node id: "${nodeId}".`
    } else if (tags.length === 1) {
        const tag = tags[0];
        const name = tag.node.name;
        const slug = tag.node.slug;
        assert(typeof name === 'string');
        assert(typeof slug === 'string');
        return {
            name: name,
            slug: slug,
        }
    } else {
        throw `Multiple tag found for tag node id: "${nodeId}".`
    }
};

const _makeCategoryById = async (nodeId, graphql) => {
    const {
        data: {
            allCategory: { edges: categories },
        },
    } = await graphql(`
        {
            allCategory( filter: { id: { eq: "${nodeId}" } } ) {
                edges {
                    node {
                        name
                        slug
                    }
                }
            }
        }
    `);

    if (categories.length === 0) {
        throw `No category found for category node id: "${nodeId}".`
    } else if (categories.length === 1) {
        const category = categories[0];
        const name = category.node.name;
        const slug = category.node.slug;
        assert(typeof name === 'string');
        assert(typeof slug === 'string');
        return {
            name: name,
            slug: slug,
        }
    } else {
        throw `Multiple category found for category node id: "${nodeId}".`
    }
};

const _makePostExcerpt = async (post, graphql) => {
    const {
        data: {
            allMdx: { edges: mdxDocuments },
        },
    } = await graphql(`
        {
            allMdx( filter: {id: {eq: "${post.node.parent.id}" } } ) {
                edges {
                    node {
                        excerpt
                    }
                }
            }
        }
    `);

    const tags = await Promise.all(post.node.tags.map(async (tag) => _makeTagById(tag, graphql)));
    const category = await _makeCategoryById(post.node.category, graphql);

    if (mdxDocuments.length === 0) {
        throw `No relative MDX document found for post: "${post.node.slug}".`
    } else if (mdxDocuments.length === 1) {
        const mdxDocument = mdxDocuments[0];
        return {
            title: post.node.title,
            // subtitle: post.node.subtitle,
            createdTime: post.node.createdTime,
            tags: tags,
            category: category,
            excerpt: mdxDocument.node.excerpt || "<i>The content is intentionally left blank.</i>",
            slug: post.node.slug,
        }
    } else {
        throw `Multiple relative MDX document found for post: "${post.node.slug}".`
    }
};

const _makeTagSummary = async (tag, graphql) => {

};

module.exports = {
    getHomePageTitle: _getHomePageTitle,
    getHomePagePath: _getHomePagePath,
    getCategoryPageTitle: _getCategoryPageTitle,
    getCategoryPagePath: _getCategoryPagePath,
    getTagPageTitle: _getTagPageTitle,
    getTagPagePath: _getTagPagePath,
    makeTagById: _makeTagById,
    makeCategoryById: _makeCategoryById,
    makePostExcerpt: _makePostExcerpt,
    makeTagSummary: _makeTagSummary,
};