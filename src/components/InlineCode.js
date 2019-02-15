import React from 'react';
import styles from './InlineCode.module.scss'

export default ({children}) => {
    return <code className={styles.inlineCodeWrapper}>
        <span className={styles.inlineCode}>{children}</span>
    </code>
}
