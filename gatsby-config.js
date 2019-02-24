require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const remarkMath = require(`remark-math`);
const mdxBackSlashSafeGuarder = require('./core/remark/mdx-backslash-safe-guarder');
const kaTexMdxTag = require(`./core/remark/katex-mdx-tag`);
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
    {
      resolve: `gatsby-plugin-webmention`,
      options: {
        username: 'wezzard.com', // webmention.io username
        identity: {
          github: 'WeZZard',
        },
        mentions: true,
        pingbacks: false,
        forwardPingbacksAsWebmentions: 'https://example.com/endpoint',
        domain: 'wezzard.com',
        token: process.env.WEBMENTIONS_TOKEN,
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
        // Exclude specific pages or groups of pages using glob parameters
        // See: https://github.com/isaacs/minimatch
        exclude: ['/tag/*'],
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
      resolve: `gatsby-mdx`,
      options: {
        extensions: ['.mdx', '.md'],
        mdPlugins: [remarkMath, mdxBackSlashSafeGuarder, kaTexMdxTag],
        globalScope: `
        import { InlineMath } from 'react-katex';
        import { BlockMath as MathBlock } from 'react-katex';
        
        export default { InlineMath, MathBlock };
        `,
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
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
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
  ],
};
