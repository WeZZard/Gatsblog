import React from 'react';
import PropTypes from 'prop-types';
import styles from './Paragraph.module.scss';

import MDXContext from './MDXContext';

import { normalizeChildren, processChildren, rawStringToSpan } from '../utils';

const Paragraph = props => (
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

Paragraph.displayName = 'Paragraph';

Paragraph.propTypes = {
  children: PropTypes.any,
};

export default Paragraph;
