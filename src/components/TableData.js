import React from 'react';
import PropTypes from 'prop-types';
import styles from './TableData.module.scss';

import InlineSegment from './InlineSegment';

const TableData = ({ align, children }) => {
  return (
    <td className={styles.tableData} align={align}>
      <InlineSegment>{children}</InlineSegment>
    </td>
  );
};

TableData.propTypes = {
  align: PropTypes.string,
  children: PropTypes.any,
};

export default TableData;
