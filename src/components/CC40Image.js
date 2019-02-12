import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Img from "gatsby-image";

const getName = (options) => {
    switch (options) {
        case 'by': return 'by';
        case 'by-nc': return 'by_nc';
        case 'by-nc-nd': return 'by_nc_nd';
        case 'by-nc-sa': return 'by_nc_sa';
        case 'by-nd': return 'by_nd';
        case 'by-sa': return 'by_sa';
        default:
            throw `Unexpected options: ${options}`;
    }
};

export default props => <StaticQuery
    query={graphql`
        {
            by: file(relativePath: { eq: "images/cc4.0-by.png" }) {
                childImageSharp {
                    fixed(width: 88, height: 32) {
                      ...GatsbyImageSharpFixed
                    }
                }
            }
            by_nc: file(relativePath: { eq: "images/cc4.0-by-nc.png" }) {
                childImageSharp {
                    fixed(width: 88, height: 32) {
                      ...GatsbyImageSharpFixed
                    }
                }
            }
            by_nc_nd: file(relativePath: { eq: "images/cc4.0-by-nc-nd.png" }) {
                childImageSharp {
                    fixed(width: 88, height: 32) {
                      ...GatsbyImageSharpFixed
                    }
                }
            }
            by_nc_sa: file(relativePath: { eq: "images/cc4.0-by-nc-sa.png" }) {
                childImageSharp {
                    fixed(width: 88, height: 32) {
                      ...GatsbyImageSharpFixed
                    }
                }
            }
            by_nd: file(relativePath: { eq: "images/cc4.0-by-nd.png" }) {
                childImageSharp {
                    fixed(width: 88, height: 32) {
                      ...GatsbyImageSharpFixed
                    }
                }
            }
            by_sa: file(relativePath: { eq: "images/cc4.0-by-sa.png" }) {
                childImageSharp {
                    fixed(width: 88, height: 32) {
                      ...GatsbyImageSharpFixed
                    }
                }
            }
        }`
    }

    render={ data => <Img fixed={data[getName(props.options)].childImageSharp.fixed}/>}
/>
