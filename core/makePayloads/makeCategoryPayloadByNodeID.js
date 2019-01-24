const assert = require('assert');

module.exports = async (nodeId, graphql) => {
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