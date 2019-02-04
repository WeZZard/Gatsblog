import React from 'react';
import Img, { GatsbyImageProps } from 'gatsby-image';

export default ({ fluid }) => (
    <StateConsumer>
        {({ mobile }) => (
            <span>
                <Img fluid={fluid} />
            </span>
        )}
    </StateConsumer>
);
