import React from "react"
import styles from './MorePostItem.module.scss'

import PostExcerptMetadata from './PostExcerptMetadata'
import { Link } from 'gatsby';

export default ({ info }) => {
    const { title, item } = info;

    const subtitleComponent =  item.subtitle !== ""
        ? <div className={styles.subtitle}>
            <h2>{item.subtitle}</h2>
        </div>
        : null;

    const excerpt = item.file.childMdx.excerpt
        || '<em>The content is intentionally left blank.</em>';

    return <div className={styles.flexWrapper}>
        <div className={styles.caption}>
            <span className={styles.captionContent}>{title}</span>
        </div>
        <div className={styles.postExcerpt}>
            <section className={styles.header}>
                <Link to={item.slug}>
                    <div className={styles.title}>
                        <h1>{item.title}</h1>
                    </div>
                    {subtitleComponent}
                </Link>
            </section>
            <section className={styles.content}>
                <p className={styles.paragraph}>
                    <Link
                        to={item.slug}
                        dangerouslySetInnerHTML={{ __html: excerpt }}
                    />
                </p>
            </section>
            <section className={styles.footer}>
                <PostExcerptMetadata post={item}/>
            </section>
        </div>
    </div>
}
