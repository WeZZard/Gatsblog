import React from "react"
import styles from './MorePostItem.module.scss'
import { Link } from 'gatsby';
import PostExcerptMetadata from './PostExcerptMetadata';

class MorePostItem extends React.Component {
    render() {
        const { info } = this.props;

        const { title, item } = info;

        const subtitleComponent =  item.subtitle !== "" ? <h2>{item.subtitle}</h2> : null;

        return <section className={styles.morePostItem}>
            <div className={styles.morePostItemCaption}>
                <span>{title}</span>
            </div>
            <div>
                <header className={styles.morePostHeader}>
                    <Link to={item.slug}>
                        <h1>{item.title}</h1>{subtitleComponent}
                    </Link>
                </header>
                <section className={styles.morePostBody}>
                    <p>
                        <Link to={item.slug} dangerouslySetInnerHTML={{ __html: item.excerpt }}/>
                    </p>
                </section>
                <footer className={styles.morePostFooter}>
                    <PostExcerptMetadata post={item}/>
                </footer>
            </div>
        </section>
    }
}

export default MorePostItem
