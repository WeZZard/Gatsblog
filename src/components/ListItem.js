import React from 'react';
import styles from './ListItem.module.scss'

import Span from './Span'

export default (props) => {
    const { type, children } = props;
    const normalizedChildren = normalizeChildren(children);
    const processedChildren = processChildren(
        normalizedChildren,
        null,
        rawStringProcessor
    );
    const className = styles[getClassName(type)];
    return <li className={className}>{processedChildren}</li>
}

const getClassName = (type) => {
    if (type === 'TaskListItem') {
        return 'taskListItem';
    }
    if (type === 'UnorderedListItem') {
        return 'unorderedListItem';
    }
    if (type === 'OrderedListItem') {
        return 'orderedListItem';
    }
    throw `Unexpected type: ${type}`;
};

const normalizeChildren = (children) => {
    if (Array.isArray(children)) {
        return children;
    } else {
        return [children];
    }
};

const processChildren = (children, processors, rawStringProcessor) => {
    return children.map((child, index) => {
        if (child.props && child.props.name) {
            if (processors) {
                const processor = processors[child.props.name];
                if (processor) {
                    return processor(child, index)
                }
            }
        } else {
            if (rawStringProcessor) {
                return rawStringProcessor(child, index)
            }
        }
        return child;
    });
};

const rawStringProcessor = (string, index) => {
    return <Span key={index}>{string}</Span>
};
