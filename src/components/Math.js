import React from 'react'
import styles from './Math.module.scss'

import { BlockMath as KaTexMath } from 'react-katex';

export default (props) => (
    <pre className={[styles.math, 'rectTop', 'rectBottom'].join(' ')}><KaTexMath {...props}/></pre>
)
