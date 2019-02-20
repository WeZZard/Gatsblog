import React from 'react';
const _ = require('lodash');

import Taxonomy from './Taxonomy';

export default ({ category }) => (
  <Taxonomy
    kind={'primary'}
    name="Category"
    taxonomies={[
      { name: category, slug: `/category/${_.kebabCase(category)}` },
    ]}
  />
);
