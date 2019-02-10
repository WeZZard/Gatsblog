import React from 'react';
import styles from './OrderedList.module.scss';

export default (props) => {
    const className = [styles.orderedList, "serifTop", "serifBottom"].join(' ');
    return <ol className={className} {...props}/>
}
