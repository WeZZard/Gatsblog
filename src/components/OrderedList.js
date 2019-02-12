import React from 'react';
import styles from './OrderedList.module.scss';
import ListItem from './ListItem'

export default props => {
    const { className, children } = props;
    const normalizedChildren = normalizeChildren(children);
    const listClassName = [className, styles.orderedList, "body-serif-top", "body-serif-bottom"].join(' ');
    const listItems = normalizedChildren.map((child, index) => {
        const { props, children } = child.props;
        const { className } = props || {};
        const type = className === 'task-list-item' ? 'TaskListItem' : 'OrderedListItem';
        return <ListItem key={index} type={type}>{children}</ListItem>
    });
    return <ol className={listClassName}>{listItems}</ol>
}

const normalizeChildren = (children) => {
    if (Array.isArray(children)) {
        return children;
    } else {
        return [children];
    }
};
