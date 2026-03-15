import React from 'react';
import PropTypes from 'prop-types';
import styles from './List.module.scss';

import ListItem from './ListItem';

import { normalizeChildren } from '../utils';

const List = props => {
  const { type, className, children } = props;
  const normalizedChildren = normalizeChildren(children);
  const listClassName = [className, styles.list, styles[type]].join(' ');
  const listItems = normalizedChildren.map((child, index) => {
    const childProps = child.props || {};
    const childClassName = childProps.className || '';
    const listType = childClassName === 'task-list-item' ? 'taskList' : type;
    return (
      <ListItem key={index} type={`${listType}Item`}>
        {childProps.children}
      </ListItem>
    );
  });
  switch (type) {
    case 'orderedList':
      return <ol className={listClassName}>{listItems}</ol>;
    case 'unorderedList':
      return <ul className={listClassName}>{listItems}</ul>;
    default:
      return <ul className={listClassName}>{listItems}</ul>;
  }
};

List.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  props: PropTypes.object,
  type: PropTypes.string,
};

export default List;
