require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
});

const remarkMath = require(`remark-math`);
const mdxBackSlashSafeGuarder = require('./core/remark/mdx-backslash-safe-guarder');
const kaTexMdxTag = require(`./core/remark/katex-mdx-tag`);

function guardBackslashesForMdx() {
    const nodeTypes = [
        'text',
        'code',
        'inlineCode',
        'math',
        'inlineMath',
    ];
    return tree => visit(tree, nodeTypes, node => {
        if (/\\/.test(node.value)) {
            node.value = node.value.replace(/\\/g, "\\\\");
        }
    })
}

module.exports = {
    plugins: [
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/content/_posts`,
                name: `Post`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/content`,
                name: `Page`,
                ignore: [`${__dirname}/content/_posts/*`],
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/assets`,
                name: `Asset`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/config`,
                name: `Config`,
            },
        },
        {
            resolve: `gatsby-mdx`,
            options: {
                extensions: ['.mdx', '.md'],
                mdPlugins: [remarkMath, mdxBackSlashSafeGuarder, kaTexMdxTag],
                gatsbyRemarkPlugins: [
                    {
                        resolve: `gatsby-remark-primitive-images`,
                        options: {
                            withWebp: true,
                            maxWidth: 1440,
                            quality: 100,
                        },
                    },
                ],
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-transformer-yaml`,
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `Pieces of My Soul`,
                short_name: `WeZZard`,
                start_url: `/`,
                background_color: `#ffffff`,
                theme_color: `#3d4260`,
                display: `minimal-ui`,
                icon: `assets/gatsby-icon.png`,
            },
        },
        `gatsby-plugin-offline`,
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-sass`,
        {
            resolve: `gatsby-plugin-web-font-loader`,
            options: {
                google: {
                    families: [
                        `Roboto:300,300i,400,400i,500,500i:latin,latin-ext`,
                        `Roboto Mono:300,300i,400,400i,500,500i:latin,latin-ext`,
                        `Gentium Book Basic:400,400i,700,700i:latin,latin-ext`,
                    ]
                }
            }
        },
    ],
};
