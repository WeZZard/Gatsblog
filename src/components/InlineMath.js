import React from 'react'
import styles from './InlineMath.module.scss'

import { InlineMath as KaTexInlineMath } from 'react-katex';

export default (props) => (
    <span className={styles.inlineMath}><KaTexInlineMath {...props}/></span>
)
