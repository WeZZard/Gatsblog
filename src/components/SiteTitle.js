import React from 'react'
import { StaticQuery, graphql, Link } from 'gatsby'

class SiteTitle extends  React.Component {
    render() {
        return <StaticQuery
            query={graphql`
                query SiteTitleQuery {
                    site {
                        siteMetadata {
                            title
                        }
                    }
                }
            `}
            render={(data) => <label>{data.site.siteMetadata.title}</label>}
        />
    }
}

export default SiteTitle
