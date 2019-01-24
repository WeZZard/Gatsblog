import React from 'react'
import { StaticQuery, graphql, Link } from 'gatsby'

class SiteTitle extends  React.Component {
    render() {
        return <StaticQuery
            query={graphql`
                query SiteTitleQuery {
                    configYaml {
                        site {
                            title
                        }
                    }
                }
            `}
            render={(data) => <label>{data.configYaml.site.title}</label>}
        />
    }
}

export default SiteTitle
