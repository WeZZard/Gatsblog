import React from 'react'
import { Link } from 'gatsby'
import styles from './PostExcerpt.module.scss'

import PostExcerptMetadata from './PostExcerptMetadata'

class PostExcerpt extends React.Component {
    render() {
        const { item } = this.props;

        const subtitleComponent =  item.subtitle !== ""
            ? <h2>{item.subtitle}</h2>
            : null;

        const excerpt = item.file.childMdx.excerpt || '<em>The content is intentionally left blank.</em>';

        return <div className={styles.postExcerpt}>
            <section className={styles.header}>
                <Link to={item.slug}>
                    <h1>{item.title}</h1>
                    {subtitleComponent}
                </Link>
            </section>
            <section className={styles.content}>
                <p>
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
}

export default PostExcerpt
