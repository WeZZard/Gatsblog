import React from 'react';
import PropTypes from 'prop-types';
import styles from './InlineParagraph.module.scss';

import MDXContext from './MDXContext';

import { normalizeChildren, processChildren, rawStringToSpan } from '../utils';

const InlineParagraph = props => (
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
        <span className={styles.flexWrapper} {...standardProps}>
          <span className={styles[textStyle]}>{processedChildren}</span>
        </span>
      );
    }}
  </MDXContext.Consumer>
);

InlineParagraph.displayName = 'InlineParagraph';

InlineParagraph.propTypes = {
  children: PropTypes.any,
};

export default InlineParagraph;
