const path = require(`path`)
const pageCreators = require(`./utils/_pageCreators`)
const nodeDecorators = require(`./utils/_nodeDecorators`)

exports.onCreateNode = ({ node, actions, getNode }) => {
    nodeDecorators(node, getNode, actions)
}

exports.createPages = ({ graphql, actions }) => {

    const { createPage } = actions

    const blogPost = path.resolve(`./src/templates/blog-post.js`)
    return graphql(
        `
            {
                allMarkdownRemark(
                    sort: { fields: [frontmatter___date], order: DESC }
                ) {
                    edges {
                        node {
                            fields {
                                slug
                            }
                            frontmatter {
                                title
                            }
                        }
                    }
                }
            }
        `
    ).then(result => {
        if (result.errors) {
            throw result.errors
        }

        // Create blog posts pages.
        const posts = result.data.allMarkdownRemark.edges

        posts.forEach((post, index) => {
            const previous =
                index === posts.length - 1 ? null : posts[index + 1].node
            const next = index === 0 ? null : posts[index - 1].node

            createPage({
                path: post.node.fields.slug,
                component: blogPost,
                context: {
                    slug: post.node.fields.slug,
                    previous,
                    next,
                },
            })
        })
    })
}
