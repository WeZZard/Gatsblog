import React from 'react';
import styles from './MathBlock.module.scss';

import { BlockMath as KaTexMath } from 'react-katex';

const MathBlock = props => (
  <pre className={styles.math}>
    <KaTexMath {...props} />
  </pre>
);

MathBlock.displayName = 'MathBlock';

export default MathBlock;
