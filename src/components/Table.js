import React from 'react';
import HorizontalScroller from './HorizontalScroller';
import styles from './Table.module.scss'

export default (props) => <HorizontalScroller>
    <table className={styles.table} {...props}/>
</HorizontalScroller>