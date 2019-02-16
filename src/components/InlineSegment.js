import React from 'react'
import styles from './InlineSegment.module.scss'

import Paragraph from './Paragraph'
import { normalizeChildren } from '../utils'

const inlineTags = [
    'span',
    'code',
    'input',
];

const isInlineElement = (child) => {
    if (typeof child === 'string') {
        return true;
    } else {
        return child.props
            && child.props.name
            && inlineTags.includes(child.props.name);
    }
};

export default (props) => {
    const { children } = props;
    const normalizedChildren = normalizeChildren(children);

    const reducedChildren = normalizedChildren.reduce((children, current) => {
        if (children.length > 0) {
            const last = children[Math.max(children.length - 1, 0)];

            const nonInlineChildren = children.slice(
                0,
                Math.max(children.length - 1, 0)
            );

            if (Array.isArray(last)) {
                if (isInlineElement(current)) {
                    return [...nonInlineChildren, [...last, current]]
                } else {
                    return [...children, current]
                }
            } else {
                if (isInlineElement(last) && isInlineElement(current)) {
                    return [...nonInlineChildren, [last, current]]
                } else if (!isInlineElement(last) && isInlineElement(current)) {
                    return [...children, [current]]
                } else {
                    return [...children, current]
                }
            }
        } else {
            if (isInlineElement(current)) {
                return [[current]]
            } else {
                return [current]
            }
        }
    }, []).map((child, index) => {
        if (Array.isArray(child)) {
            return <Paragraph key={index} children={child}/>
        } else {
            return child;
        }
    });

    return <div className={styles.inlineSegment}>{reducedChildren}</div>
}
