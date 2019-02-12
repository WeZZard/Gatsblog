import React from 'react'
import styles from './Blockquote.module.scss'
import { edgesWithGridSystem } from '../utils'

export default props => {
    const className = edgesWithGridSystem({
        style: styles.blockquote,
        top: 'rect',
        bottom: 'rect',
    });

    return <blockquote className={className} {...props}/>
}
