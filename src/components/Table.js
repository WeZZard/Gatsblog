import React from 'react';
import styles from './Table.module.scss'
import { edgesWithGridSystem } from '../utils'

export default props => {
    const className = edgesWithGridSystem({
        style: styles.tableWrapper,
        top: 'rect',
        bottom: 'rect',
    });

    return <div className={className}>
        <table className={styles.table} {...props}/>
    </div>
}
