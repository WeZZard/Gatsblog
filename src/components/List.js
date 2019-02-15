import React from 'react';
import styles from './List.module.scss';

import ListItem from './ListItem'

import { normalizeChildren } from '../utils'

export default props => {
    const { type, className, children } = props;
    const normalizedChildren = normalizeChildren(children);
    const listClassName = [className, styles.list, styles[type]].join(' ');
    const listItems = normalizedChildren.map((child, index) => {
        const { props, children } = child.props;
        const { className } = props || {};
        const listType = className === 'task-list-item' ? 'taskList' : type;
        return <ListItem key={index} type={`${listType}Item`}>
            {children}
        </ListItem>
    });
    return <ol className={listClassName}>{listItems}</ol>
}
