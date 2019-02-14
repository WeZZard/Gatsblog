import React from 'react'
import { Link } from 'gatsby'
import _ from 'lodash'
import styles from './TagSummary.module.scss'

class TagSummary extends React.Component {
    getRelatedPosts(posts, tag, limit=5) {
        return posts
            .sort((p1, p2) => p1.createdTime > p2.createdTime)
            .filter(post => post.tags.includes(tag))
            .slice(0, limit);
    }

    render() {
        const {
            tag,
            baseSlug,
            posts
        } = this.props;

        const slug = `${baseSlug}/${_.kebabCase(tag)}`;

        const relatedPosts = this.getRelatedPosts(posts, tag);

        const relatedPostComponents = relatedPosts.map((relatedPost, index) => {
            return <li key={index}>
                <Link to={relatedPost.slug}>
                    <h1>{relatedPost.title}</h1>
                </Link>
            </li>
        });

        return <div className={styles.summary}>
            <h1 className={styles.tagName}>{tag}</h1>
            <div className={styles.postList}>
                <ul>{relatedPostComponents}</ul>
            </div>
            <div className={styles.more}><Link to={slug}>More ...</Link></div>
        </div>
    }
}

export default TagSummary
