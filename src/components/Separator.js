import React from 'react';
import styles from './Separator.module.scss'

export default props => {
    const className = [styles.separator, 'body-separator'].join(' ');
    return <hr className={className} {...props}/>
}
