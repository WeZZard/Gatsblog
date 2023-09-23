import React from 'react';
import PropTypes from 'prop-types';
import styles from './InlineSegment.module.scss';
import MDXRenderer from 'gatsby-mdx';

import InlineParagraph from './InlineParagraph';
import { normalizeChildren } from '../utils';

const inlineTags = ['label', 'span', 'code', 'input', 'a', 'sup', 'sub'];

const inlinePropsNames = [...inlineTags, 'inlineCode'];

const isInlineElement = child => {
  if (typeof child === 'string') {
    console.log(`is string`);
    return true;
  } else if (child && child.props && typeof child.props === 'string') {
    console.log(`is string props`);
    return true;
  } else {
    const isInlinablePropsName = child && child.props && child.props.name
      && inlinePropsNames.includes(child.props.name)
    const isInlinableType = child && child.type
      && typeof child.type === 'string'
      && inlineTags.includes(child.type)
    console.log(`isInlinablePropsName: ${isInlinablePropsName}`);
    console.log(`isInlinableType: ${isInlinableType}`);
    return isInlinablePropsName || isInlinableType;
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
          console.log(`first child. build paragraph`);
          return [[currentChild]];
        } else {
          console.log(`first child. add as a paragraph`);
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
            console.log(`non-first child. concate to paragraph`);
            return [...completedParagraphs, [...paragraphToReduce, currentChild]];
          } else {
            console.log(`non-first child. add as a paragraph`);
            return [...reducedParagraphs, currentChild];
          }
        } else {
          if (isInlineElement(paragraphToReduce) && isInlineElement(currentChild)) {
            console.log(`non-first child. concate to paragraph`);
            return [...completedParagraphs, [paragraphToReduce, currentChild]];
          } else if (!isInlineElement(paragraphToReduce) && isInlineElement(currentChild)) {
            console.log(`non-first child. build paragraph`);
            return [...reducedParagraphs, [currentChild]];
          } else {
            console.log(`non-first child. add as a paragraph`);
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
