import React from 'react';
import PropTypes from 'prop-types';
import styles from './TableHeader.module.scss';

import InlineSegment from './InlineSegment';

const TableHeader = ({ align, children }) => {
  return (
    <th className={styles.tableHeader} align={align}>
      <InlineSegment>{children}</InlineSegment>
    </th>
  );
};

TableHeader.propTypes = {
  align: PropTypes.string,
  children: PropTypes.any,
};

export default TableHeader;
