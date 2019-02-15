import React from 'react';
import styles from './TableHeader.module.scss'
import { normalizeChildren, processChildren, rawStringToSpan } from '../utils';

export default props => {
    const { align, children } = props;

    const normalizedChildren = normalizeChildren(children);

    const processedChildren = processChildren(
        normalizedChildren,
        null,
        rawStringToSpan
    );

    return <th className={styles.tableHeader} align={align} children={processedChildren}/>
};
