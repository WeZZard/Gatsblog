import React from 'react'
import styles from './PostListLayout.module.scss'

class PostListLayout extends React.Component {
    render() {
        const { children } = this.props;

        return <section className={styles.postListContainer}>
            {children}
        </section>;
    }
}

export default PostListLayout