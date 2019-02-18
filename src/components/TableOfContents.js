import React from 'react'
import assert from 'assert'
import _ from 'lodash'
import styles from './TableOfContents.module.scss'
import styled from 'styled-components'

import Link from './Link'

const Item = styled.li`
    @media (max-width: 1440px) {
        transition-delay: ${({isOpen, index, count}) => 
            isOpen ? 0.56 - index * (0.56 / count) : 0.56 + index * (0.2 / count)
        }s;
    }
`;

class TableOfContents extends React.Component {
    render() {
        const {
            headings,
            tocItemOnClick,
            isOpen
        } = this.props;

        assert(headings.length > 0);

        const items = [];

        const indicesStack = [0];

        function fillStackGap(depth) {
            while (indicesStack.length < depth) {
                indicesStack.push(0)
            }
            for (let i = depth; i < indicesStack.length; i ++) {
                indicesStack[i] = 0;
            }
        }

        function increaseStack(depth) {
            assert(depth <= indicesStack.length, `stack: ${indicesStack}`);
            indicesStack[depth - 1] = indicesStack[depth - 1] + 1;
        }

        function snapshotStack(depth) {
            assert(depth <= indicesStack.length, `stack: ${indicesStack}`);
            return indicesStack.slice(0, depth);
        }

        headings.forEach(item => {
            const { value, depth } = item;
            fillStackGap(depth);
            increaseStack(depth);
            const indices = snapshotStack(depth);
            items.push({title: value, indices});
        });

        while (items.reduce((prev, curr) => {
                if (prev && prev.index) {
                    const { flag, index } = prev;
                    return { flag: flag && (index === curr.indices[0]), index: curr }
                } else {
                    return { flag: true, index: curr.indices[0] }
                }
            }, {flag: true, index: null}).flag && items.length > 1)
        {
            items.forEach(each => each.indices.shift());
        }

        let tocClassNames = [styles.tableOfContents];

        if (isOpen) {
            tocClassNames.push(styles.open);
        }

        let tocClassName = tocClassNames.join(' ');

        let component = <ul className={styles.list}>
            {items.map((item, index) => {
                const url = `#${_.kebabCase(item.title)}`;
                return <Item
                    className={styles.item}
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
                        <span className={styles.title}>
                            {item.title}
                        </span>
                        <span className={styles.index}>
                            {item.indices.join('.')}
                        </span>
                    </Link>
                </Item>
            })}
        </ul>;

        return <div className={tocClassName}>
            <div className={styles.header}>
                <label className={styles.title}>Table of Contents</label>
            </div>
            <nav className={styles.body}>
                {component}
            </nav>
        </div>;
    }
}

export default TableOfContents