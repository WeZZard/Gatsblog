import React from 'react';
import styles from './Footnotes.module.scss'
import { edgesWithGridSystem } from '../utils'

export default props => {
    const { children } = props;
    const separator = children[0];
    const footnotes = children.slice(1);
    const className = edgesWithGridSystem({
        style: styles.footnotes,
        top: 'sans',
        bottom: 'sans',
    });
    return <React.Fragment>
        {separator}
        <section className={className}>
            <FootnoteList {...footnotes[0].props}/>
        </section>
    </React.Fragment>;
}

class FootnoteListItem extends React.Component {
    render() {
        const footnoteId = this.props.props.id.slice(3);
        const normalizedChildren = normalizeChildren(this.props.children);
        const processedChildren = processFootnoteListItemChildren(
            normalizedChildren,
            footnoteId,
            { p }
        );
        return <li id={this.props.props.id} className={styles.footnoteListItem}>
            {processedChildren}
        </li>
    }
}

class FootnoteList extends React.Component {
    render() {
        const { children } = this.props;
        const listItems = children.map((child, index) =>
            <FootnoteListItem key={index} {...child.props}/>);
        return <ul className={styles.footnoteList}>
            {listItems}
        </ul>;
    }

}

const normalizeChildren = (children) => {
    if (Array.isArray(children)) {
        return children;
    } else {
        return [children];
    }
};

const processFootnoteListItemChildren = (children, footnoteId, processors) => {
    return children.map((child, index) => {
        if (child.props && child.props.name) {
            const processor = processors[child.props.name];
            if (processor) {
                return processor(child, index, footnoteId)
            }
        }
        return child;
    });
};

const processChildren = (children, processors) => {
    return children.map((child, index) => {
        if (child.props && child.props.name) {
            const processor = processors[child.props.name];
            if (processor) {
                return processor(child, index)
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
        { a }
    );

    if (index === 0) {
        const footnoteLabel = <label className={styles.footnoteLabel}>
            {footnoteId}
        </label>;
        return <p key={index} className={styles.footnoteParagraph}>
            {footnoteLabel}
            {processedChildren}
        </p>
    } else {
        return <p key={index} className={styles.footnoteParagraph}>
            {processedChildren}
        </p>
    }
};

const a = (child, index) => {
    const {
        children,
        props,
    } = child.props;

    if (props.className === 'footnote-backref') {
        const {
            href
        } = props;

        return <a key={index} className={styles.footnoteBackReference} href={href}>{'^'}</a>
    }

    return <a key={index} {...props}>{children}</a>
};
