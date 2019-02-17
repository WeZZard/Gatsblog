import React from 'react';
import styles from './Table.module.scss'

import MDXContext from './MDXContext'

export default props => {
    return <MDXContext.Provider value={'sans'}>
        <div className={styles.wrapper}>
            <table className={styles.table} {...props}/>
        </div>
    </MDXContext.Provider>
}
