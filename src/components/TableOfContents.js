import React from 'react';
import PropTypes from 'prop-types';
import assert from 'assert';
import _ from 'lodash';
import styles from './TableOfContents.module.scss';
import styled from 'styled-components';

import Link from './Link';

const Item = styled.li`
  @media (max-width: 1280px) {
    transition-delay: ${({ isOpen, index, count }) =>
      isOpen ? 0.56 - index * (0.56 / count) : 0.2 + index * (0.56 / count)}s;
  }
`;

class TableOfContents extends React.Component {
  render() {
    const { headings, tocItemOnClick, isOpen } = this.props;

    const items = [];

    const indicesStack = [];

    function fillStackHead(depth) {
      while (indicesStack.length < depth) {
        indicesStack.push(1);
      }
    }

    function clearStackTail(depth) {
      for (let i = depth; i < indicesStack.length; i++) {
        indicesStack[i] = 0;
      }
    }

    function increaseStackAtDepth(depth) {
      assert(depth <= indicesStack.length, `stack: ${indicesStack}`);
      indicesStack[depth - 1] = indicesStack[depth - 1] + 1;
    }

    function snapshotStack(depth) {
      assert(depth <= indicesStack.length, `stack: ${indicesStack}`);
      return indicesStack.slice(0, depth);
    }

    let previousDepth = 0;

    headings.forEach(item => {
      const { value, depth } = item;

      if (indicesStack.length < depth) {
        fillStackHead(depth);
      } else {
        clearStackTail(depth);

        increaseStackAtDepth(depth);
      }

      const indices = snapshotStack(depth);
      items.push({ title: value, indices });

      previousDepth = depth;
    });

    while (
      items.reduce(
        (previous, current) => {
          if (previous && previous.index !== null) {
            const { shouldShift: flag, index } = previous;
            const canShift = current.indices.length > 1;
            const isSameIndex = index === current.indices[0];
            const shouldShift = flag && isSameIndex && canShift;
            return { shouldShift, index: current.indices[0] };
          } else {
            return {
              shouldShift: current.indices.length > 1,
              index: current.indices[0],
            };
          }
        },
        { shouldShift: false, index: null },
      ).shouldShift
    ) {
      items.forEach(each => each.indices.shift());
    }

    let tocClassNames = [styles.tableOfContents];

    if (isOpen) {
      tocClassNames.push(styles.open);
    }

    let tocClassName = tocClassNames.join(' ');

    let component = (
      <ul className={styles.sectionList}>
        {items.map((item, index) => {
          const url = `#${_.kebabCase(item.title)}`;
          return (
            <Item
              className={styles.section}
              key={index}
              index={index}
              count={items.length}
              isOpen={isOpen}
            >
              <Link
                kind={'toc'}
                to={url}
                className={styles.content}
                onClick={tocItemOnClick}
              >
                <span className={styles.sectionName}>{item.title}</span>
                <span className={styles.sectionIndex}>
                  {item.indices.join('.')}
                </span>
              </Link>
            </Item>
          );
        })}
      </ul>
    );

    return (
      <div className={tocClassName}>
        <div className={styles.header}>
          <label className={styles.title}>Table of Contents</label>
        </div>
        <nav className={styles.body}>{component}</nav>
      </div>
    );
  }
}

TableOfContents.propTypes = {
  headings: PropTypes.arrayOf(PropTypes.object).isRequired,
  isOpen: PropTypes.bool.isRequired,
  tocItemOnClick: PropTypes.func.isRequired,
};

export default TableOfContents;
