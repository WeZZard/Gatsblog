import React from 'react'
import MDXRenderer from "gatsby-mdx/mdx-renderer";
import styles from './PageDocument.module.scss';

import TimeLabel from './TimeLabel';
import MetadataItem from './MetadataItem'
import InlineMath from './InlineMath';
import Math from './Math';

class PageDocument extends React.Component {
    render() {
        const { page } = this.props;
        const {
            title,
            subtitle,
            createdTime,
            file: {
                childMdx: {
                    code,
                },
            },
        } = page;

        const createdTimeComponent = <TimeLabel dateTime={createdTime}/>;

        const subtitleComponent = subtitle
            ? <h2 className={styles.subtitle}>{subtitle}</h2>
            : null;

        return <article className={styles.document}>
            <header className={styles.header}>
                <h1 className={styles.title}>{title}</h1>
                {subtitleComponent}
                <div className={styles.caption}>
                    <MetadataItem>{createdTimeComponent}</MetadataItem>
                </div>
            </header>
            <section className={styles.content}>
                <MDXRenderer scope={{InlineMath, Math}}>{code.body}</MDXRenderer>
            </section>
        </article>
    }
}

export default PageDocument
