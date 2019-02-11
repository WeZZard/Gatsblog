import React from 'react';
import styles from './Span.module.scss'

export default (props) => {
    const className = ["serifTop", "serifBottom"].join(' ');
    return <span className={className} {...props}/>
}
