import React from 'react';
import styles from './ListItem.module.scss'

import { normalizeChildren, processChildren } from '../utils'

const P = props => <p className={styles.paragraph} {...props} />;

export default props => {
    const { type, children } = props;
    const normalizedChildren = normalizeChildren(children);
    const processedChildren = processChildren(
        normalizedChildren,
        null,
        rawStringProcessor
    );

    const reducedChildren = processedChildren.reduce((children, current, currentIndex) => {
        if (children.length > 0) {
            const last = children[Math.max(children.length - 1, 0)];

            const leadingChildren = children.slice(
                0,
                Math.max(children.length - 2, 0)
            );

            if (['span', 'code'].includes(last.type) && ['span', 'code'].includes(current.type)) {
                return [...leadingChildren, <P>{last}{current}</P>]
            } else if (last.name === 'p' && ['span', 'code'].includes(current.type)) {
                return [...leadingChildren, <P>{last.children}{current}</P>]
            } else if (!['span', 'code'].includes(last.type) && ['span', 'code'].includes(current.type)) {
                return [...leadingChildren, last, <P>{current}</P>]
            } else {
                return [...children, current]
            }
        } else {
            if (['span', 'code'].includes(current.type)) {
                return [<P>{current}</P>]
            } else {
                return [current]
            }
        }
    }, []);

    const wrappedChildren = reducedChildren.map((child, index) => {
        if (child.type.toString() === P.toString()) {
            return <div key={index} className={styles.paragraphWrapper}>{child}</div>
        } else {
            return child
        }
    });

    return <li className={styles[type]}>
        <div className={styles.contentContainer}>{wrappedChildren}</div>
    </li>
}

const rawStringProcessor = (string, index) => {
    return <span key={index}>{string}</span>
};
