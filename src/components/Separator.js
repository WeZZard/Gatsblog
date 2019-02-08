import React from 'react';
import styles from './Separator.module.scss'

export default (props) => {
    const className = [styles.separator, 'separator'].join(' ');
    return <hr className={className} {...props}/>
}
