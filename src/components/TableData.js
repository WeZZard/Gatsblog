import React from 'react';
import styles from './TableData.module.scss';

import InlineSegment from './InlineSegment';

export default props => {
  const { align, children } = props;

  return (
    <td className={styles.tableData} align={align}>
      <InlineSegment children={children} />
    </td>
  );
};
