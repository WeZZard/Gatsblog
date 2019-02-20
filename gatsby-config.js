require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const remarkMath = require(`remark-math`);
const mdxBackSlashSafeGuarder = require('./core/remark/mdx-backslash-safe-guarder');
const kaTexMdxTag = require(`./core/remark/katex-mdx-tag`);

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
          ],
        },
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
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
                    {
                        config: configYaml {
                            site {
                                title
                                description
                                owner
                            }
                        }
                    }
                `,
        setup: {},
        feeds: [
          {
            setup: ({
              query: {
                config: { site },
                ...rest
              },
            }) => {
              let siteUrl = process.env.GATSBY_SITE_URL || '';

              let safeSiteUrl;
              if (siteUrl.endsWith('/')) {
                safeSiteUrl = siteUrl.substring(0, siteUrl.length - 1);
              } else {
                safeSiteUrl = siteUrl;
              }

              return {
                site_url: safeSiteUrl,
                feed_url: safeSiteUrl + '/rss.xml',
                copyright: site.owner,
                title: site.title,
                description: site.description,
                ...rest,
              };
            },
            serialize: ({ query: { allPost } }) => {
              return allPost.edges.map(edge => {
                const post = edge.node;
                const mdx = edge.node.file.childMdx;

                let siteUrl = process.env.GATSBY_SITE_URL || '';

                let safeSiteUrl;
                if (siteUrl.endsWith('/')) {
                  safeSiteUrl = siteUrl.substring(0, siteUrl.length - 1);
                } else {
                  safeSiteUrl = siteUrl;
                }

                const url = safeSiteUrl + post.slug;

                return Object.assign(
                  {},
                  { title: post.title },
                  {
                    description: mdx.excerpt,
                    date: post.createdTime,
                    url: url,
                    guid: url,
                    custom_elements: [
                      {
                        'content:encoded': mdx.html,
                      },
                    ],
                  },
                );
              });
            },
            query: `
                            {
                                allPost(
                                    filter: { 
                                        isPublished: { eq: true },
                                        isLocalized: { eq: false } 
                                    }
                                    sort: { order: DESC, fields: [createdTime] }
                                ) {
                                    edges {
                                        node {
                                            title
                                            createdTime
                                            slug
                                            file {
                                                childMdx {
                                                    excerpt
                                                    html
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        `,
            output: '/rss.xml',
            title: ({ query: { config } }) => config.site.title,
          },
        ],
      },
    },
  ],
};
