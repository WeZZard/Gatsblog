import React from 'react';
import PropTypes from 'prop-types';
import styles from './InlineSegment.module.scss';
import MDXRenderer from 'gatsby-mdx';

import InlineParagraph from './InlineParagraph';
import { normalizeChildren } from '../utils';

const inlineTags = ['label', 'span', 'code', 'input', 'a', 'sup', 'sub'];

const inlinePropsNames = ['inlineCode', 'sup', 'sub', 'a'];

const isInlineElement = child => {
  if (typeof child === 'string') {
    return true;
  } else if (child && child.props && typeof child.props === 'string') {
    return true;
  } else {
    return (
      (child &&
        child.props &&
        child.props.name &&
        inlinePropsNames.includes(child.props.name)) ||
      (child && child.type && inlineTags.includes(child.type))
    );
  }
};

const InlineSegment = props => {
  const { children } = props;

  console.log(`children:`, children);

  // The children were normalized into an array.
  const normalizedChildren = normalizeChildren(children);

  const reducedParagraphs = normalizedChildren
    .reduce((reducedParagraphs, currentChild) => {
      console.log(`current to reduce`, currentChild);
      if (reducedParagraphs.length == 0) {
        if (isInlineElement(currentChild)) {
          return [[currentChild]];
        } else {
          return [currentChild];
        }
      } else {
        const paragraphToReduce = reducedParagraphs[Math.max(reducedParagraphs.length - 1, 0)];

        const completedParagraphs = reducedParagraphs.slice(
          0,
          Math.max(reducedParagraphs.length - 1, 0),
        );

        if (Array.isArray(paragraphToReduce)) {
          if (isInlineElement(currentChild)) {
            return [...completedParagraphs, [...paragraphToReduce, currentChild]];
          } else {
            return [...reducedParagraphs, currentChild];
          }
        } else {
          if (isInlineElement(paragraphToReduce) && isInlineElement(currentChild)) {
            return [...completedParagraphs, [paragraphToReduce, currentChild]];
          } else if (!isInlineElement(paragraphToReduce) && isInlineElement(currentChild)) {
            return [...reducedParagraphs, [currentChild]];
          } else {
            return [...reducedParagraphs, currentChild];
          }
        }
      }
    }, [])
    .map((eachParagraphs, index) => {
      console.log(`reduced child`, eachParagraphs);
      if (Array.isArray(eachParagraphs)) {
        return (
          <InlineParagraph key={`inline-paragraph: ${index}`}>
            {eachParagraphs}
          </InlineParagraph>
        );
      } else {
        return eachParagraphs;
      }
    });

  return <div className={styles.flexWrapper}>
    <div className={styles.inlineSegment}>{reducedParagraphs}</div>
  </div>;
};

InlineSegment.propTypes = {
  children: PropTypes.any,
};

export default InlineSegment;
