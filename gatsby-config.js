// Load Node.js v11.10.0 compatibility polyfills
// require('./polyfill');

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const remarkMath = require(`remark-math`);
const mdxTagKaTex = require(`./core/remark/mdx-tag-katex`);
const gatsbyPluginFeedOptions = require(`./gatsby-plugin-feed-options`);

module.exports = {
  plugins: [
    ////////////////////////////////////////////////////////////////////////////
    // Site Info
    ////////////////////////////////////////////////////////////////////////////
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
    ////////////////////////////////////////////////////////////////////////////
    // SEO
    ////////////////////////////////////////////////////////////////////////////
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        policy: [
          { userAgent: 'Baiduspider', disallow: '/' },
          { userAgent: 'Sosospider', disallow: '/' },
          { userAgent: 'sogou spider', disallow: '/' },
          { userAgent: 'YodaoBot', disallow: '/' },
          { userAgent: '*', allow: '/' },
        ],
        query: `{
          site: config {
            siteMetadata: site {
              siteUrl: url
            }
          }
        }`,
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        // Updated configuration for gatsby-plugin-sitemap v5
        excludes: ['/tag/*'],
        query: `
          {
            site: config {
              siteMetadata: site{
                siteUrl: url
              }
            }
            allSitePage {
              edges {
                node {
                  path
                }
              }
            }
        }`,
      },
    },
    ////////////////////////////////////////////////////////////////////////////
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
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: ['.mdx'],
        // Updated configuration format for gatsby-plugin-mdx v5 + MDX v2
        mdxOptions: {
          remarkPlugins: [remarkMath, mdxTagKaTex],
        },
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-copy-linked-files',
          },
          {
            resolve: `gatsby-remark-mdx-images`,
            options: {
              withWebp: { quality: 90 },
              maxWidth: 712,
            },
          },
        ],
      },
    },
    `gatsby-transformer-remark`,
    `gatsby-transformer-sharp`,
    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        useMozJpeg: false,
        stripMetadata: true,
        defaultQuality: 75,
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        implementation: require('sass'),
      },
    },
    `gatsby-plugin-catch-links`,
    {
      resolve: `gatsby-plugin-web-font-loader`,
      options: {
        google: {
          families: [
            `Roboto:300,300i,400,400i,500,500i:latin,latin-ext`,
            `Roboto Mono:300,300i,400,400i,500,500i:latin,latin-ext`,
            `Gentium Book Basic:400,400i,700,700i:latin,latin-ext`,
          ],
        },
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: gatsbyPluginFeedOptions,
    },
    // Temporarily disabled gatsby-plugin-offline for Node.js v11.10.0 compatibility
    // `gatsby-plugin-offline`,
  ],
};
