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
  feeds: [
    {
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
      title: 'RSS Feed',
    },
  ],
};
