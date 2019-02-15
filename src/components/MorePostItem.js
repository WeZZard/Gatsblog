import React from "react"
import styles from './MorePostItem.module.scss'

import PostExcerptMetadata from './PostExcerptMetadata'
import { Link } from 'gatsby';

class MorePostItem extends React.Component {
    render() {
        const { info } = this.props;

        const { title, item } = info;

        const subtitleComponent =  item.subtitle !== ""
            ? <h2 className={styles.subtitle}>{item.subtitle}</h2>
            : null;

        const excerpt = item.file.childMdx.excerpt
            || '<em>The content is intentionally left blank.</em>';

        return <div className={styles.morePostItem}>
            <div className={styles.metadata}>
                <span>{title}</span>
            </div>
            <div className={styles.postExcerpt}>
                <section className={styles.header}>
                    <Link to={item.slug}>
                        <h1 className={styles.title}>{item.title}</h1>
                        {subtitleComponent}
                    </Link>
                </section>
                <section className={styles.content}>
                    <Link
                        to={item.slug}
                        dangerouslySetInnerHTML={{ __html: excerpt }}
                    />
                </section>
                <section className={styles.footer}>
                    <PostExcerptMetadata post={item}/>
                </section>
            </div>
        </div>
    }
}

export default MorePostItem
