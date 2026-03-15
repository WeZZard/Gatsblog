module.exports = {
  query: `
    {
      config {
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
          const mdx = edge.node.file ? edge.node.file.childMdx : null;

          let siteUrl = process.env.GATSBY_SITE_URL || '';

          let safeSiteUrl;
          if (siteUrl.endsWith('/')) {
            safeSiteUrl = siteUrl.substring(0, siteUrl.length - 1);
          } else {
            safeSiteUrl = siteUrl;
          }

          const url = safeSiteUrl + post.slug;
          const excerpt = mdx ? mdx.excerpt : '';

          return Object.assign(
            {},
            { title: post.title },
            {
              description: excerpt,
              date: post.createdTime,
              url: url,
              guid: url,
              custom_elements: [
                {
                  'content:encoded': excerpt,
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
            sort: { createdTime: DESC }
          ) {
            edges {
              node {
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
        }
      `,
      output: '/rss.xml',
      title: ({ query: { config } }) => config.site.title,
    },
  ],
};
