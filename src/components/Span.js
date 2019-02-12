import React from 'react';
import styles from './Span.module.scss'

export default props => {
    const className = ["body-serif-top", "body-serif-bottom"].join(' ');
    return <span className={className} {...props}/>
}
