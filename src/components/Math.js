import React from 'react'
import styles from './Math.module.scss'
import { edgesWithGridSystem } from '../utils'

import { BlockMath as KaTexMath } from 'react-katex';

export default props => {
    const className = edgesWithGridSystem({
        style: styles.math,
        top: 'rect',
        bottom: 'rect',
    });

    return <pre className={className}><KaTexMath {...props}/></pre>
}
