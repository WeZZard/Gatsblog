import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
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

        return (
          <Helmet
            htmlAttributes={{ lang }}
            title={title}
            titleTemplate={`%s`}
            meta={[
              {
                name: `description`,
                content: description,
              },
              {
                property: `og:title`,
                content: pageTitle,
              },
              {
                property: `og:description`,
                content: description,
              },
              {
                property: `og:type`,
                content: `website`,
              },
              {
                name: `twitter:card`,
                content: `summary`,
              },
              {
                name: `twitter:creator`,
                content: siteOwner,
              },
              {
                name: `twitter:title`,
                content: pageTitle,
              },
              {
                name: `twitter:description`,
                content: description,
              },
            ]
              .concat(
                keywords.length ? { name: `keywords`, content: keywords } : [],
              )
              .concat(meta)}
          />
        );
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
