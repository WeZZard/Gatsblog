import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';

const SEO = ({
  lang: pageLang,
  title: pageTitle,
  description: pageDescription,
  keywords: pageKeywords,
  meta,
}) => {
  return (
    <StaticQuery
      query={componentQuery}
      render={({
        config: {
          site: {
            lang: siteLang,
            title: siteTitle,
            description: siteDescription,
            owner: siteOwner,
            keywords: siteKeywords,
          },
        },
      }) => {
        const description = pageDescription || siteDescription;
        const keywords = pageKeywords.join(', ') || siteKeywords.join(', ');
        const title =
          pageTitle !== null && pageTitle !== undefined
            ? `${pageTitle} | ${siteTitle}`
            : siteTitle;
        const lang = pageLang || siteLang || 'en-US';

        // Client-side meta tag updates to avoid circular reference issues
        React.useEffect(() => {
          if (typeof document !== 'undefined') {
            // Update title
            document.title = title;
            
            // Update or create meta tags
            const metaUpdates = [
              { name: 'description', content: description },
              { property: 'og:title', content: pageTitle },
              { property: 'og:description', content: description },
              { property: 'og:type', content: 'website' },
              { name: 'twitter:card', content: 'summary' },
              { name: 'twitter:creator', content: siteOwner },
              { name: 'twitter:title', content: pageTitle },
              { name: 'twitter:description', content: description },
            ];
            
            if (keywords.length) {
              metaUpdates.push({ name: 'keywords', content: keywords });
            }
            
            // Add custom meta tags
            if (meta && meta.length) {
              metaUpdates.push(...meta);
            }
            
            metaUpdates.forEach(({ name, property, content }) => {
              const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
              let metaTag = document.querySelector(selector);
              
              if (!metaTag) {
                metaTag = document.createElement('meta');
                if (name) metaTag.name = name;
                if (property) metaTag.property = property;
                document.head.appendChild(metaTag);
              }
              
              metaTag.content = content;
            });
            
            // Update html lang attribute
            if (document.documentElement) {
              document.documentElement.lang = lang;
            }
          }
        }, [title, description, keywords, pageTitle, siteOwner, meta, lang]);

        // Return null during SSR to avoid any rendering issues
        return null;
      }}
    />
  );
};

SEO.defaultProps = {
  meta: [],
  keywords: [],
};

SEO.propTypes = {
  lang: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  meta: PropTypes.array,
};

export default SEO;

const componentQuery = graphql`
  query SEOQuery {
    config {
      site {
        lang
        title
        description
        owner
        keywords
      }
    }
  }
`;
