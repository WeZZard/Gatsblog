import React from 'react';
import PropTypes from 'prop-types';
import styles from './TableOfContents.module.scss';
import Link from './Link';

const kebabCase = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

const Item = ({ className, children, isOpen, index, count, ...rest }) => {
  const delay = isOpen ? 0.2 + 0.07 * index : 0.56 - index * (0.56 / (count - 1));
  return (
    <li className={className} style={{ transitionDelay: `${delay}s` }} {...rest}>
      {children}
    </li>
  );
};

class TableOfContents extends React.Component {
  render() {
    const { headings, menuItemDidTap, isOpen } = this.props;

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
      if (depth <= indicesStack.length) {
        indicesStack[depth - 1] = indicesStack[depth - 1] + 1;
      }
    }

    function snapshotStack(depth) {
      return indicesStack.slice(0, Math.min(depth, indicesStack.length));
    }

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
          const url = `#${kebabCase(item.title)}`;
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
                className={styles.anchor}
                onClick={menuItemDidTap}
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
  menuItemDidTap: PropTypes.func.isRequired,
};

export default TableOfContents;
