import React from 'react'
import styles from './Blockquote.module.scss'

export default (props) => {
    const className = [styles.blockquote, 'rectTop', 'rectBottom'].join(' ');
    return <blockquote className={className} {...props}/>
}
