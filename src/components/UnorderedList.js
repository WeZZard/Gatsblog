import React from 'react';
import styles from './UnorderedList.module.scss'

export default (props) => {
    const className = [styles.unorderedList, "serifTop", "serifBottom"].join(' ');
    return <ul className={className} {...props}/>
}
