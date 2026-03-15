import React from 'react';
import PropTypes from 'prop-types';

import Taxonomy from './Taxonomy';

const kebabCase = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

const CategoryLabel = ({ category }) => (
  <Taxonomy
    kind={'primary'}
    name="Category"
    taxonomies={[
      { name: category, slug: `/category/${kebabCase(category)}` },
    ]}
  />
);

CategoryLabel.propTypes = {
  category: PropTypes.string,
};

export default CategoryLabel;
