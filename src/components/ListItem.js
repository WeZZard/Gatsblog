import React from 'react';
import styles from './ListItem.module.scss'

import { normalizeChildren, processChildren } from '../utils'

const P = ({children}) => <p className={styles.paragraph} {...{name: 'p'}}>
    {children}
</p>;

const inlineTags = [
    'span',
    'code',
    'input',
];

export default props => {
    const { type, children } = props;

    const normalizedChildren = normalizeChildren(children);
    const processedChildren = processChildren(
        normalizedChildren,
        null,
        rawStringProcessor
    );

    console.log('processedChildren: ', processedChildren);

    const reducedChildren = processedChildren.reduce((children, current) => {
        if (children.length > 0) {
            const last = children[Math.max(children.length - 1, 0)];

            const nonInlineChildren = children.slice(
                0,
                Math.max(children.length - 1, 0)
            );

            if (Array.isArray(last) && inlineTags.includes(current.props.name)) {
                return [...nonInlineChildren, [...last, current]]
            } else if (inlineTags.includes(last.props.name) && inlineTags.includes(current.props.name)) {
                return [...nonInlineChildren, [last, current]]
            } else if (!inlineTags.includes(last.props.name) && inlineTags.includes(current.props.name)) {
                return [...children, [current]]
            } else {
                return [...children, current]
            }
        } else {
            if (inlineTags.includes(current.props.name)) {
                return [[current]]
            } else {
                return [current]
            }
        }
    }, []).map((child, index) => {
        if (Array.isArray(child)) {
            return <div key={index} className={styles.paragraphWrapper}>
                <P key={index} children={child}/>
            </div>
        } else {
            return child;
        }
    });

    return <li className={styles[type]}>
        <div className={styles.contentContainer}>{reducedChildren}</div>
    </li>
}

const rawStringProcessor = (string, index) => {
    return <span key={index} {...{name: 'span'}}>{string}</span>
};
