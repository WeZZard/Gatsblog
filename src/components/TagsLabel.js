import React from 'react';
const _ = require('lodash');

import Taxonomy from './Taxonomy';

export default ({ tags }) => (
  <Taxonomy
    kind={'secondary'}
    name="Tags"
    taxonomies={tags.map(t => ({
      name: t,
      slug: `/tag/${_.kebabCase(t)}`,
    }))}
  />
);
