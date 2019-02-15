import React from 'react'
import styles from './Link.module.scss'

export default props => {
    const { className } = props;
    const newProps = {...props};
    delete newProps.className;

    return <a className={[styles.link, className].join(' ')} {...props}/>
}
