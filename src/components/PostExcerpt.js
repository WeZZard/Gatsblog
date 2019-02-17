import React from 'react'
import styles from './PostExcerpt.module.scss'

import PostExcerptMetadata from './PostExcerptMetadata'
import { Link } from 'gatsby'

export default ({ item }) => {
    const subtitleComponent =  item.subtitle !== ""
        ? <h2 className={styles.subtitle}>{item.subtitle}</h2>
        : null;

    const excerpt = item.file.childMdx.excerpt
        || '<em>The content is intentionally left blank.</em>';

    return <div className={styles.flexWrapper}>
        <section className={styles.header}>
            <Link to={item.slug}>
                <h1 className={styles.title}>{item.title}</h1>
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
}
