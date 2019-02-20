import React from 'react';
import styles from './TableHeader.module.scss';

import InlineSegment from './InlineSegment';

export default props => {
  const { align, children } = props;

  return (
    <th className={styles.tableHeader} align={align}>
      <InlineSegment children={children} />
    </th>
  );
};
