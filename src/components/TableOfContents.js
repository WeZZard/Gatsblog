import React from 'react'
import styles from './TableOfContents.module.scss'
import _ from 'lodash'

class TableOfContents extends React.Component {
    render() {
        const { tableOfContents: rootTocNode } = this.props;

        let rootList;

        let stack = [{tocNode: rootTocNode, indexToRead: 0, listItems: []}];

        while (stack.length > 0) {
            const {tocNode, indexToRead, listItems} = stack.pop();

            if (tocNode.items && indexToRead < tocNode.items.length) {
                const childTocNode = tocNode.items[indexToRead];

                const { items, url, title } = childTocNode;

                let listItem = {};

                if (url && title) {
                    const correctUrl = `#${_.kebabCase(title)}`;
                    listItem.link = <a href={correctUrl}>{title}</a>;
                }

                stack.push({
                    tocNode,
                    indexToRead: indexToRead + 1,
                    listItems: [...listItems, listItem]
                });

                stack.push({tocNode: childTocNode, indexToRead: 0, listItems: []});
            } else {
                const sublistItems = listItems.map((listItem, index) => {
                    const linkComponent = listItem.link;
                    const sublistComponent = listItem.sublist;
                    return <li key={index}>{linkComponent}{sublistComponent}</li>
                });

                const sublist = sublistItems.length
                    ? <ol>{sublistItems}</ol>
                    : null;

                if (sublist) {
                    if (stack.length > 0) {
                        const {
                            tocNode: parentTocNode,
                            indexToRead: parentIndexToRead,
                            listItems: parentChildListItems
                        } = stack.pop();

                        parentChildListItems[parentIndexToRead - 1].sublist = sublist;

                        stack.push({
                            tocNode: parentTocNode,
                            indexToRead: parentIndexToRead,
                            listItems: parentChildListItems
                        })
                    } else {
                        rootList = sublist
                    }
                }
            }
        }

        return <div className={[styles.tableOfContents, styles.tableOfContentsBackgroundBlur].join(' ')}>
            <div className={styles.tableOfContentsHeader}>
                <h1>Table of Contents</h1>
            </div>
            <div className={styles.tableOfContentsList}>
                {rootList}
            </div>
        </div>;
    }
}

export default TableOfContents
