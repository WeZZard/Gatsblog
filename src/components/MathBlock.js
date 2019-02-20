import React from 'react';
import styles from './MathBlock.module.scss';

import { BlockMath as KaTexMath } from 'react-katex';

export default props => {
  return (
    <pre className={styles.math}>
      <KaTexMath {...props} />
    </pre>
  );
};
