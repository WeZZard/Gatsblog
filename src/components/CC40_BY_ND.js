import React from 'react';
import { StaticQuery } from 'gatsby';
import Img from "gatsby-image";

export default () => <StaticQuery
    query={graphql`
        {
            file(relativePath: { eq: "images/cc4.0-by-nd.png" }) {
                childImageSharp {
                    fixed(width: 88, height: 32) {
                      ...GatsbyImageSharpFixed
                    }
                }
            }
        }`
    }
    render={ data => <Img fixed={data.file.childImageSharp.fixed}/>}
/>
