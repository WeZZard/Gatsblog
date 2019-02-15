import React from 'react'
import styles from './PostHeader.module.scss'

import MetadataItem from './MetadataItem';
import TimeLabel from './TimeLabel';
import CategoryLabel from './CategoryLabel'

class PostHeader extends React.Component {
    render() {
        const {
            title,
            subtitle,
            createdTime,
            category,
        } = this.props;

        const createdTimeComponent = <TimeLabel dateTime={createdTime}/>;

        const categoryComponent = <CategoryLabel category={category}/>;

        const subtitleComponent = subtitle
            ? <div className={styles.subtitle}><h2>{subtitle}</h2></div>
            : null;

        return <React.Fragment>
            <div className={styles.title}><h1>{title}</h1></div>
            {subtitleComponent}
            <div className={styles.metadata}>
                <MetadataItem>{createdTimeComponent}</MetadataItem>
                <MetadataItem>{categoryComponent}</MetadataItem>
            </div>
        </React.Fragment>
    }
}

export default PostHeader
