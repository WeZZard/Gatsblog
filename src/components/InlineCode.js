import React from 'react';
import styles from './InlineCode.module.scss'

export default (props) => {
    return <code className={styles.inlineCode} {...props}/>
}
