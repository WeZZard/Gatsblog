import React from 'react';
import styles from './ListItem.module.scss'

import InlineSegment from './InlineSegment'

export default props => {
    const { type, children } = props;
    console.log(children);
    return <li className={[styles.listItem, styles[type]].join(' ')}>
        <InlineSegment children={children}/>
    </li>
}
