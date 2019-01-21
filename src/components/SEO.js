import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

const SEO = ({ description: pageDescription, lang, meta, keywords, pageTitle}) => {
    return (
        <StaticQuery
            query={detailsQuery}
            render={data => {

                const {
                    site: {
                        siteMetadata: {
                        title: siteTitle,
                            description: siteDescription,
                            siteOwner,
                        }
                    },
                } = data;

                const description = pageDescription || siteDescription;

                const title = (pageTitle !== null && pageTitle !== undefined) ? `${pageTitle} | ${siteTitle}` : siteTitle;

                return (
                    <Helmet
                        htmlAttributes={{
                            lang,
                        }}
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
                                keywords.length > 0
                                    ? {
                                          name: `keywords`,
                                          content: keywords.join(`, `),
                                      }
                                    : []
                            )
                            .concat(meta)}
                    />
                )
            }}
        />
    )
};

SEO.defaultProps = {
    lang: `en`,
    meta: [],
    keywords: [],
};

SEO.propTypes = {
    description: PropTypes.string,
    lang: PropTypes.string,
    meta: PropTypes.array,
    keywords: PropTypes.arrayOf(PropTypes.string),
    pageTitle: PropTypes.string,
};

export default SEO

const detailsQuery = graphql`
    query SEOQuery {
        site {
            siteMetadata {
                title
                description
                siteOwner
            }
        }
    }
`;
