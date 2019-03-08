import React from 'react';
import PropTypes from 'prop-types';
import styles from './Footnotes.module.scss';

import MDXContext from './MDXContext';
import { normalizeChildren, processChildren, rawStringToSpan } from '../utils';
import InlineSegment from './InlineSegment';

class FootnoteList extends React.Component {
  render() {
    const { children } = this.props;
    const normalizedChildren = normalizeChildren(children);
    const listItems = normalizedChildren.map((child, index) => (
      <FootnoteItem key={index} {...child.props} />
    ));
    return <ul className={styles.footnoteList}>{listItems}</ul>;
  }
}

FootnoteList.propTypes = {
  children: PropTypes.any,
};

class FootnoteItem extends React.Component {
  render() {
    const footnoteId = this.props.props.id.slice(3);
    const footnoteLabel = (
      <label key={'id'} className={styles.label}>
        {footnoteId}
      </label>
    );

    const normalizedChildren = normalizeChildren(this.props.children);

    const totalChildren = [footnoteLabel, ...normalizedChildren];

    const processedChildren = processChildren(
      totalChildren,
      { a },
      rawStringToSpan,
    );

    return (
      <li id={this.props.props.id} className={styles.footnoteItem}>
        <InlineSegment>{processedChildren}</InlineSegment>
      </li>
    );
  }
}

FootnoteItem.propTypes = {
  children: PropTypes.any,
  props: PropTypes.object,
};

const a = (child) => {
  const {
    props: {
      children,
      props: { className, ...restPropsProps },
      ...restProps
    },
    ...rest
  } = child;

  if (className === 'footnote-backref') {
    return {
      props: {
        children: '^',
        props: {
          className: styles.backReference,
          ...restPropsProps,
        },
        ...restProps,
      },
      ...rest,
    };
  } else {
    return child;
  }
};

const Footnotes = ({ children }) => {
  const separator = children[0];
  const footnotes = children.slice(1);
  return (
    <React.Fragment>
      {separator}
      <MDXContext.Provider value={'sans'}>
        <section className={styles.flexWrapper}>
          {footnotes.map((footnotesItem, index) => (
            <FootnoteList key={index} {...footnotesItem.props} />
          ))}
        </section>
      </MDXContext.Provider>
    </React.Fragment>
  );
};

Footnotes.propTypes = {
  children: PropTypes.any,
};

Footnotes.displayName = 'Footnotes';

export default Footnotes;
