import React from 'react'
import styles from './HorizontalScroller.module.scss'
import { edgesWithGridSystem } from '../utils'

export default props => {
    const className = edgesWithGridSystem({
        style: styles.horizontalScroller,
        top: 'rect',
        bottom: 'rect',
    });

    return <div className={className} {...props}/>
}
