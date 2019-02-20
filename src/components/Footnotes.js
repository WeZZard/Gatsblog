import React from 'react';
import PropTypes from 'prop-types';
import styles from './Footnotes.module.scss';

import Anchor from './Anchor';
import Paragraph from './Paragraph';
import MDXContext from './MDXContext';
import { normalizeChildren, processChildren, rawStringToSpan } from '../utils';

class FootnoteList extends React.Component {
  render() {
    const { children } = this.props;
    const listItems = children.map((child, index) => (
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
    const normalizedChildren = normalizeChildren(this.props.children);
    const processedChildren = processFootnoteListItemChildren(
      normalizedChildren,
      footnoteId,
      { p },
    );
    return (
      <li id={this.props.props.id} className={styles.footnoteItem}>
        {processedChildren}
      </li>
    );
  }
}

FootnoteItem.propTypes = {
  children: PropTypes.any,
  props: PropTypes.object,
};

const processFootnoteListItemChildren = (children, footnoteId, processors) => {
  return children.map((child, index) => {
    if (child.props && child.props.name) {
      const processor = processors[child.props.name];
      if (processor) {
        return processor(child, index, footnoteId);
      }
    }
    return child;
  });
};

const p = (child, index, footnoteId) => {
  const { children } = child.props;

  const normalizedChildren = normalizeChildren(children);
  const processedChildren = processChildren(
    normalizedChildren,
    { a },
    rawStringToSpan,
  );

  if (index === 0) {
    const footnoteLabel = <label className={styles.label}>{footnoteId}</label>;

    return (
      <Paragraph key={index}>
        {footnoteLabel}
        {processedChildren}
      </Paragraph>
    );
  } else {
    return <Paragraph key={index}>{processedChildren}</Paragraph>;
  }
};

const a = (child, index) => {
  const { children, props: p } = child.props;

  if (p.className === 'footnote-backref') {
    const { href } = p;

    return (
      <span key={index} className={styles.backReference}>
        <Anchor href={href}>{'^'}</Anchor>
      </span>
    );
  }

  return (
    <span key={index}>
      <Anchor {...p}>{children}</Anchor>
    </span>
  );
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
