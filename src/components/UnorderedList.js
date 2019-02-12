import React from 'react';
import styles from './UnorderedList.module.scss'
import ListItem from './ListItem'

export default (props) => {
    const { className, children } = props;
    const normalizedChildren = normalizeChildren(children);
    const listClassName = [className, styles.unorderedList, "serifTop", "serifBottom"].join(' ');
    const listItems = normalizedChildren.map((child, index) => {
        const { props, children } = child.props;
        const { className } = props || {};
        const type = className === 'task-list-item' ? 'TaskListItem' : 'UnorderedListItem';
        return <ListItem key={index} type={type}>{children}</ListItem>
    });
    return <ul className={listClassName}>{listItems}</ul>
}

const normalizeChildren = (children) => {
    if (Array.isArray(children)) {
        return children;
    } else {
        return [children];
    }
};
