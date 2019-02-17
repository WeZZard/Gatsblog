import React from 'react'
import styles from './MDXHeader.module.scss'

import MetadataItem from './MetadataItem';
import TimeLabel from './TimeLabel';
import CategoryLabel from './CategoryLabel'

class MDXHeader extends React.Component {
    render() {
        const {
            textStyle,
            title,
            subtitle,
            createdTime,
            category,
        } = this.props;

        const createdTimeComponent = <MetadataItem>
            <TimeLabel dateTime={createdTime}/>
        </MetadataItem>;

        const subtitleComponent = subtitle
            ? <div className={styles.subtitle}>
                <h2 className={styles[textStyle]}>{subtitle}</h2>
            </div>
            : null;

        const categoryComponent = category
            ? <MetadataItem><CategoryLabel category={category}/></MetadataItem>
            : null;

        return <React.Fragment>
            <div className={styles.title}>
                <h1 className={styles[textStyle]}>{title}</h1>
            </div>
            {subtitleComponent}
            <div className={styles.metadata}>
                {createdTimeComponent}
                {categoryComponent}
            </div>
        </React.Fragment>
    }
}

export default MDXHeader
