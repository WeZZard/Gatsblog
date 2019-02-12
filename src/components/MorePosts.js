import assert from 'assert'

import React from "react"
import styles from './MorePosts.module.scss'

import MorePostItem from './MorePostItem'
import ContentSeparator from './ContentSeparator'

class MorePosts extends React.Component {
    render() {
        const { earlierPostExcerpt, laterPostExcerpt } = this.props;

        assert(earlierPostExcerpt || laterPostExcerpt);

        const morePostInfo = [
            { item: earlierPostExcerpt, title: 'Earlier Post' },
            { item: laterPostExcerpt, title: 'Later Post' },
        ].filter(_ => _.item);

        const components = morePostInfo
            .map(info => <div
                key={info.title}
                className={styles.morePostItemContainer}
            >
                <MorePostItem info={info}/>
            </div>);

        return <React.Fragment>
            <ContentSeparator/>
            <div className={styles.morePostsContainer}>
                {components}
            </div>
        </React.Fragment>
    }
}

export default MorePosts
