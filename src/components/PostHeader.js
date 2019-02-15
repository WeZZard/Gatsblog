import React from 'react'
import styles from './PostHeader.module.scss'

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
            ? <section className={styles.subtitle}><h2>{subtitle}</h2></section>
            : null;

        return <React.Fragment>
            <section className={styles.title}><h1>{title}</h1></section>
            {subtitleComponent}
            <div className={styles.metadata}>
                <MetadataItem>{createdTimeComponent}</MetadataItem>
                <MetadataItem>{categoryComponent}</MetadataItem>
            </div>
        </React.Fragment>
    }
}

export default PostHeader
