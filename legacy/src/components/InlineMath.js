import React from 'react';
import styles from './InlineMath.module.scss';

import { InlineMath as KaTexInlineMath } from 'react-katex';

const InlineMath = props => (
  <span className={styles.inlineMath}>
    <KaTexInlineMath {...props} />
  </span>
);

InlineMath.displayName = 'InlineMath';

export default InlineMath;
