import React from 'react';
import PropTypes from 'prop-types';

import Taxonomy from './Taxonomy';

const kebabCase = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

const TagsLabel = ({ tags }) => (
  <Taxonomy
    kind={'secondary'}
    name="Tags"
    taxonomies={tags.map(t => ({
      name: t,
      slug: `/tag/${kebabCase(t)}`,
    }))}
  />
);

TagsLabel.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TagsLabel;
