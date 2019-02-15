import React from 'react'
import styles from './PostHeader.module.scss'

import MetadataItem from './MetadataItem';
import TimeLabel from './TimeLabel';

class PageHeader extends React.Component {
    render() {
        const {
            title,
            subtitle,
            createdTime,
        } = this.props;

        const createdTimeComponent = <TimeLabel dateTime={createdTime}/>;

        const subtitleComponent = subtitle
            ? <div className={styles.subtitle}><h2>{subtitle}</h2></div>
            : null;

        return <React.Fragment>
            <div className={styles.title}><h1>{title}</h1></div>
            {subtitleComponent}
            <div className={styles.metadata}>
                <MetadataItem>{createdTimeComponent}</MetadataItem>
            </div>
        </React.Fragment>
    }
}

export default PageHeader
