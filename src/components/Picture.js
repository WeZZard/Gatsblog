import React from 'react';
import styles from './Picture.module.scss'
import { edgesWithGridSystem } from '../utils'

export default props => {
    const className = edgesWithGridSystem({
        style: styles.picture,
        top: 'rect',
        bottom: 'rect',
    });

    return <picture className={className} {...props}/>;
}
