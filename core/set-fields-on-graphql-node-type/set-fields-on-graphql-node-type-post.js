const { GraphQLString, GraphQLList } = require('gatsby/graphql');

module.exports = async (args) => {
    const { type, getNode } = args;

    if (type.name === 'Post') {
        return {
            tags: {
                type: new GraphQLList(GraphQLString),
                resolve: (source) => {
                    const parent = getNode(source.parent);
                    if (parent.frontmatter.tags) {
                        return parent.frontmatter.tags;
                    }
                    return []
                }
            },
            category: {
                type: GraphQLString,
                resolve: (source) => {
                    const parent = getNode(source.parent);
                    if (parent.frontmatter.category) {
                        return parent.frontmatter.category;
                    }
                    return 'Uncategorized'
                }
            }
        }
    }

    return {}
};
