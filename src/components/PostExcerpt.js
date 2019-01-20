import React from 'react'
import { Link } from 'gatsby'
import styles from './PostExcerpt.module.scss'

import PostExcerptMetadata from './PostExcerptMetadata'

class PostExcerpt extends React.Component {
    render() {
        const { item } = this.props;

        const subtitleComponent =  item.node.fields.subtitle !== "" ? <h2>{item.node.fields.subtitle}</h2> : null;

        console.log(item.node.excerpt);

        return <section className={styles.postExcerptItem}>
            <header className={styles.postExcerptHeader}>
                <Link to={item.node.fields.slug}>
                    <h1>{item.node.fields.title}</h1>
                    {subtitleComponent}
                </Link>
            </header>
            <section className={styles.postExcerptBody}>
                <Link to={item.node.fields.slug}>
                    <p dangerouslySetInnerHTML={{ __html: item.node.excerpt }} />
                </Link>
            </section>
            <footer className={styles.postExcerptFooter}>
                <PostExcerptMetadata post={item}/>
            </footer>
        </section>;
    }
}

export default PostExcerpt
