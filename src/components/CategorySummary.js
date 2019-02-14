import React from 'react'
import { Link } from 'gatsby'
import _ from 'lodash'

class CategorySummary extends React.Component {
    getRelatedPosts(posts, category, limit=5) {
        return posts
            .sort((p1, p2) => p1.createdTime > p2.createdTime)
            .filter(post => post.category === category)
            .slice(0, limit);
    }

    render() {
        const {
            category,
            baseSlug,
            posts
        } = this.props;

        const slug = `${baseSlug}/${_.kebabCase(category)}`;

        const relatedPosts = this.getRelatedPosts(posts, category);

        const relatedPostComponents = relatedPosts.map((relatedPost, index) => {
            return <li key={index}>
                <Link to={relatedPost.slug}>
                    <h1>{relatedPost.title}</h1>
                    <h2>{relatedPost.subtitle}</h2>
                </Link>
            </li>
        });

        return <div>
            <h1>{tag}</h1>
            <div><ul>{relatedPostComponents}</ul></div>
            <div><Link to={slug}>More ...</Link></div>
        </div>
    }
}

export default CategorySummary
