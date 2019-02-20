import React from 'react';
import styles from './InlineSegment.module.scss';

import Paragraph from './Paragraph';
import { normalizeChildren } from '../utils';

const inlineTags = ['span', 'code', 'input', 'a'];

const isInlineElement = child => {
  if (typeof child === 'string') {
    return true;
  } else {
    return (
      child &&
      child.props &&
      child.props.name &&
      inlineTags.includes(child.props.name)
    );
  }
};

export default props => {
  const { children } = props;
  const normalizedChildren = normalizeChildren(children);

  const reducedChildren = normalizedChildren
    .reduce((reducedChildren, current) => {
      if (reducedChildren.length > 0) {
        const last = reducedChildren[Math.max(reducedChildren.length - 1, 0)];

        const nonInlineChildren = reducedChildren.slice(
          0,
          Math.max(reducedChildren.length - 1, 0),
        );

        if (Array.isArray(last)) {
          if (isInlineElement(current)) {
            return [...nonInlineChildren, [...last, current]];
          } else {
            return [...reducedChildren, current];
          }
        } else {
          if (isInlineElement(last) && isInlineElement(current)) {
            return [...nonInlineChildren, [last, current]];
          } else if (!isInlineElement(last) && isInlineElement(current)) {
            return [...reducedChildren, [current]];
          } else {
            return [...reducedChildren, current];
          }
        }
      } else {
        if (isInlineElement(current)) {
          return [[current]];
        } else {
          return [current];
        }
      }
    }, [])
    .map((child, index) => {
      if (Array.isArray(child)) {
        return <Paragraph key={index} children={child} />;
      } else {
        return child;
      }
    });

  return <div className={styles.inlineSegment}>{reducedChildren}</div>;
};
