import React from 'react';
import PropTypes from 'prop-types';
import styles from './ListItem.module.scss';

import InlineSegment from './InlineSegment';

const ListItem = ({ type, children }) => {
  return (
    <li className={[styles.listItem, styles[type]].join(' ')}>
      <InlineSegment>{children}</InlineSegment>
    </li>
  );
};

ListItem.propTypes = {
  children: PropTypes.any,
  type: PropTypes.string,
};

export default ListItem;
