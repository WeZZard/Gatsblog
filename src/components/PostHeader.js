import React from 'react'
import styles from './PostBody.module.scss'

import TimeLabel from './TimeLabel'
import CategoryLabel from './CategoryLabel'
import MetadataItem from './MetadataItem'

class PostHeader extends React.Component {
    render() {
        const { post } = this.props;
        const {
            title,
            subtitle,
            createdTime,
            category,
        } = post;

        const createdTimeComponent = <TimeLabel dateTime={createdTime}/>;

        const categoryComponent = <CategoryLabel category={category}/>;

        const subtitleComponent = subtitle
            ? <h2 className={styles.subtitle}>{subtitle}</h2>
            : null;

        return <React.Fragment>
            <h1 className={styles.title}>{title}</h1>
            {subtitleComponent}
            <div className={styles.caption}>
                <MetadataItem>{createdTimeComponent}</MetadataItem>
                <MetadataItem>{categoryComponent}</MetadataItem>
            </div>
        </React.Fragment>
    }
}

export default PostHeader
