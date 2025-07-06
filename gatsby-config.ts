import type { GatsbyConfig } from "gatsby";
import path from "path";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Pieces of My Soul`,
    author: `WeZZard`,
    description: `WeZZard's personal blog`,
    siteUrl: `https://wezzard.com`,
    social: {
      github: `WeZZard`,
    },
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    // Filesystem sources
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: path.resolve(`./content/_posts`),
        name: `Post`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: path.resolve(`./content`),
        name: `Page`,
        ignore: [`**/.*`, `**/_posts/**/*`],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: path.resolve(`./assets`),
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: path.resolve(`./config`),
        name: `config`,
      },
    },

    // Content transformers
    `gatsby-transformer-yaml`,
    `gatsby-transformer-sharp`,
    
    // Image processing
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,

    // MDX processing
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        mdxOptions: {
          remarkPlugins: [
            require(`remark-math`),
          ],
          rehypePlugins: [
            require(`rehype-katex`),
          ],
        },
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-copy-linked-files`,
            options: {
              destinationDir: `static`,
            },
          },
        ],
      },
    },

    // Styling
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        implementation: require("sass"),
        sassOptions: {
          includePaths: [path.resolve(__dirname, "src/styles")],
        },
      },
    },

    // SEO and PWA
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

    // RSS Feed
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allPost } }: any) => {
              return allPost.nodes.map((node: any) => {
                return Object.assign({}, {
                  title: node.title,
                  description: node.file.childMdx.excerpt,
                  date: node.createdTime,
                  url: site.siteMetadata.siteUrl + '/post/' + node.slug,
                  guid: site.siteMetadata.siteUrl + '/post/' + node.slug,
                });
              });
            },
            query: `
              {
                allPost(
                  sort: { createdTime: DESC }
                  filter: { isPublished: { eq: true } }
                ) {
                  nodes {
                    title
                    createdTime
                    slug
                    file {
                      childMdx {
                        excerpt
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "WeZZard's Blog RSS Feed",
          },
        ],
      },
    },

    // Sitemap
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage {
              nodes {
                path
              }
            }
          }
        `,
        excludes: [`/tag/*`],
      },
    },

    // Robots.txt
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
      },
    },
  ],
};

export default config;