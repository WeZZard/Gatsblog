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
                        resolve: `gatsby-remark-katex`,
                    },
                    {
                        resolve: `gatsby-remark-props-images`,
                        options: {
                            withWebp: true,
                            maxWidth: 822,
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
