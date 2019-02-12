import React from 'react'
import { Link } from 'gatsby'
import styles from './PostExcerpt.module.scss'

import PostExcerptMetadata from './PostExcerptMetadata'

class PostExcerpt extends React.Component {
    render() {
        const { item } = this.props;

        console.log(item);

        const subtitleComponent =  item.subtitle !== ""
            ? <h2>{item.subtitle}</h2>
            : null;

        return <section className={styles.postExcerptItem}>
            <header className={styles.postExcerptHeader}>
                <Link to={item.slug}>
                    <h1>{item.title}</h1>
                    {subtitleComponent}
                </Link>
            </header>
            <section className={styles.postExcerptBody}>
                <p>
                    <Link
                        to={item.slug}
                        dangerouslySetInnerHTML={{ __html: item.excerpt }}
                    />
                </p>
            </section>
            <footer className={styles.postExcerptFooter}>
                <PostExcerptMetadata post={item}/>
            </footer>
        </section>
    }
}

export default PostExcerpt
