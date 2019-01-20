import React from 'react'
import { Link } from 'gatsby'
import styles from './PostExcerpt.module.scss'

import PostExcerptMetadata from './PostExcerptMetadata'

class PostExcerpt extends React.Component {
    render() {
        const { item } = this.props;

        return <section>
            <header className={styles.excerptHeader}>
                <Link to={item.node.fields.slug}>
                    <h1>{item.node.fields.title}</h1>
                    { item.node.fields.subtitle !== "" ? <h2>{item.node.fields.subtitle}</h2> : null}
                </Link>
            </header>
            <section className={styles.excerptBody}>
                <Link to={item.node.fields.slug}>
                    <p dangerouslySetInnerHTML={{ __html: item.excerpt }} />
                </Link>
            </section>
            <footer className={styles.excerptFooter}>
                <PostExcerptMetadata post={item}/>
            </footer>
        </section>;
    }
}

export default PostExcerpt
