import React from 'react';
import styles from './Paragraph.module.scss';

import MDXContext from './MDXContext';

import { normalizeChildren, processChildren, rawStringToSpan } from '../utils';

export default props => {
  return (
    <MDXContext.Consumer>
      {textStyle => {
        const { children } = props;

        const standardProps = {
          ...props,
        };
        delete standardProps.textStyle;
        delete standardProps.children;

        const normalizedChildren = normalizeChildren(children);
        const processedChildren = processChildren(
          normalizedChildren,
          null,
          rawStringToSpan,
        );

        return (
          <div className={styles.flexWrapper} {...standardProps}>
            <p className={styles[textStyle]}>{processedChildren}</p>
          </div>
        );
      }}
    </MDXContext.Consumer>
  );
};
