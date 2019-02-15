import React from 'react';
import styles from './Paragraph.module.scss'

import Span from './Span'

import { normalizeChildren, processChildren } from '../utils'

export default props => {
    const {
        textStyle = 'serif',
        children,
    } = props;

    const standardProps = {
        ...props
    };
    delete standardProps.textStyle;
    delete standardProps.children;

    const normalizedChildren = normalizeChildren(children);
    const processedChildren = processChildren(
        normalizedChildren,
        null,
        rawString
    );

    return <div className={styles.paragraphWrapper} {...standardProps}>
        <p className={styles[textStyle]}>{processedChildren}</p>
    </div>
}

const rawString = (child, index) => {
    return <Span key={index}>{child}</Span>
};
