import React from 'react';
import styles from './Table.module.scss'

export default props => {
    return <div className={styles.tableWrapper}>
        <table className={styles.table} {...props}/>
    </div>
}
