module.exports = async (args) => {
    const { id, graphql } = args;

    const result = await graphql(`
        {
            allMdx(filter: {id: {eq: "${id}"}}) {
                edges {
                    node {
                        excerpt(pruneLength: 300)
                        html
                        code {
                            body
                            scope
                        }
                        tableOfContents
                        headings {
                            value
                            depth
                        }
                    }
                }
            }
        }
    `);

    if (!result.data && result.errors) {
        throw result.errors;
    }

    const { data: { allMdx } } = result;

    const { edges: mdxDocuments } = allMdx || { edges: [] };

    if (mdxDocuments.length === 1) {
        return {
            excerpt: mdxDocuments[0].excerpt,
            html: mdxDocuments[0].html,
            code: mdxDocuments[0].code,
            tableOfContents: mdxDocuments[0].tableOfContents,
            headings: mdxDocuments[0].headings,
        };
    } else if (mdxDocuments.length === 0) {
        throw `No MDX document found for node id: ${id}`;
    } else {
        throw `Multiple MDX document found for node id: ${id}`;
    }
};
