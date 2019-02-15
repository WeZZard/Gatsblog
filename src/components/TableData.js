import React from 'react';
import styles from './TableData.module.scss'
import { normalizeChildren, processChildren, rawStringToSpan } from '../utils';

export default props => {
    const { align, children } = props;

    const normalizedChildren = normalizeChildren(children);

    const processedChildren = processChildren(
        normalizedChildren,
        null,
        rawStringToSpan
    );

    return <td className={styles.tableData} align={align} children={processedChildren}/>
};
