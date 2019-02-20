import React from 'react';
import PropTypes from 'prop-types';
const _ = require('lodash');

import Taxonomy from './Taxonomy';

const TagsLabel = ({ tags }) => (
  <Taxonomy
    kind={'secondary'}
    name="Tags"
    taxonomies={tags.map(t => ({
      name: t,
      slug: `/tag/${_.kebabCase(t)}`,
    }))}
  />
);

TagsLabel.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TagsLabel;
