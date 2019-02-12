import React from 'react'
import Renderer from "./Renderer";
import styles from './PostDocument.module.scss'

import TimeLabel from './TimeLabel'
import CategoryLabel from './CategoryLabel'
import TagsLabel from './TagsLabel'
import MetadataItem from './MetadataItem'
import License from './License';

class PostDocument extends React.Component {
    render() {
        const { post, defaultLicense } = this.props;
        const {
            title,
            subtitle,
            createdTime,
            tags,
            category,
            file: {
                childMdx: {
                    code,
                },
            },
            license
        } = post;

        const createdTimeComponent = <TimeLabel dateTime={createdTime}/>;

        const categoryComponent = <CategoryLabel category={category}/>;

        const tagsComponent = tags.length > 0
            ? <div><MetadataItem><TagsLabel tags={tags}/></MetadataItem></div>
            : null;

        const subtitleComponent = subtitle
            ? <h2 className={styles.subtitle}>{subtitle}</h2>
            : null;

        return <article className={styles.document}>
            <header className={styles.header}>
                <h1 className={styles.title}>{title}</h1>
                {subtitleComponent}
                <div className={styles.caption}>
                    <MetadataItem>{createdTimeComponent}</MetadataItem>
                    <MetadataItem>{categoryComponent}</MetadataItem>
                </div>
            </header>
            <section className={styles.content}>
                <Renderer textStyle={'serif'}>{code.body}</Renderer>
            </section>
            <footer className={styles.footer}>
                {tagsComponent}
                <div><License license={license || defaultLicense} /></div>
            </footer>
        </article>
    }
}

export default PostDocument
