import React from 'react';
import PropTypes from 'prop-types';
const _ = require('lodash');

import Taxonomy from './Taxonomy';

const CategoryLabel = ({ category }) => (
  <Taxonomy
    kind={'primary'}
    name="Category"
    taxonomies={[
      { name: category, slug: `/category/${_.kebabCase(category)}` },
    ]}
  />
);

CategoryLabel.propTypes = {
  category: PropTypes.string,
};

export default CategoryLabel;
