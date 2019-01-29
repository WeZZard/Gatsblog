require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
});

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
                gatsbyRemarkPlugins: [
                    {
                        resolve: `gatsby-remark-copy-linked-files`,
                        options: { },
                    },
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 590,
                            sizeByPixelDensity: true,
                        },
                    },
                    {
                        resolve: `gatsby-remark-smartypants`,
                        options: { },
                    },
                    {
                        resolve: `gatsby-remark-katex`,
                        options: { },
                    },
                    {
                        resolve: `gatsby-remark-prismjs`,
                        options: {
                            classPrefix: 'language-',
                            inlineCodeMarker: null,
                            aliases: {},
                        },
                    },
                    {
                        resolve: `gatsby-remark-responsive-iframe`,
                        options: {
                            wrapperStyle: `margin-bottom: 1.0725rem`,
                        },
                    },
                    {
                        resolve: `gatsby-remark-autolink-headers`,
                        options: { },
                    },
                ],
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-transformer-yaml`,
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-plugin-google-analytics`,
            options: {
                //trackingId: `ADD YOUR TRACKING ID HERE`,
            },
        },
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
            resolve: 'gatsby-plugin-web-font-loader',
            options: {
                google: {
                    families: [
                        `Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i`,
                        `Roboto Mono:100,100i,300,300i,400,400i,500,500i,700,700i`,
                        `Gentium Book Basic:400,400i,700,700i`,
                    ]
                }
            }
        },
    ],
};
