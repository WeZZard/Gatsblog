const assert = require('assert');

module.exports = async (nodeId, graphql) => {
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