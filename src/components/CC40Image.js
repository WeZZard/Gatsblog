import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const getName = options => {
  switch (options) {
    case 'by':
      return 'by';
    case 'by-nc':
      return 'by_nc';
    case 'by-nc-nd':
      return 'by_nc_nd';
    case 'by-nc-sa':
      return 'by_nc_sa';
    case 'by-nd':
      return 'by_nd';
    case 'by-sa':
      return 'by_sa';
    default:
      throw `Unexpected options: ${options}`;
  }
};

const CC40Image = ({ options }) => (
  <StaticQuery
    query={graphql`
      {
        by: file(relativePath: { eq: "images/cc4.0-by.png" }) {
          childImageSharp {
            gatsbyImageData(width: 88, height: 32, layout: FIXED)
          }
        }
        by_nc: file(relativePath: { eq: "images/cc4.0-by-nc.png" }) {
          childImageSharp {
            gatsbyImageData(width: 88, height: 32, layout: FIXED)
          }
        }
        by_nc_nd: file(relativePath: { eq: "images/cc4.0-by-nc-nd.png" }) {
          childImageSharp {
            gatsbyImageData(width: 88, height: 32, layout: FIXED)
          }
        }
        by_nc_sa: file(relativePath: { eq: "images/cc4.0-by-nc-sa.png" }) {
          childImageSharp {
            gatsbyImageData(width: 88, height: 32, layout: FIXED)
          }
        }
        by_nd: file(relativePath: { eq: "images/cc4.0-by-nd.png" }) {
          childImageSharp {
            gatsbyImageData(width: 88, height: 32, layout: FIXED)
          }
        }
        by_sa: file(relativePath: { eq: "images/cc4.0-by-sa.png" }) {
          childImageSharp {
            gatsbyImageData(width: 88, height: 32, layout: FIXED)
          }
        }
      }
    `}
    render={data => {
      const image = getImage(data[getName(options)]);
      return image ? <GatsbyImage image={image} alt={`CC 4.0 ${options}`} /> : null;
    }}
  />
);

CC40Image.propTypes = {
  options: PropTypes.string.isRequired,
};

export default CC40Image;
