import React from 'react'
import styles from './MDXHeader.module.scss'

import MetadataItem from './MetadataItem';
import TimeLabel from './TimeLabel';
import CategoryLabel from './CategoryLabel'
import MDXContext from './MDXContext'

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
            ? <div className={styles.subtitle}><h2>{subtitle}</h2></div>
            : null;

        const categoryComponent = category
            ? <MetadataItem><CategoryLabel category={category}/></MetadataItem>
            : null;

        return <MDXContext.Provider value={textStyle}>
            <div className={styles.title}><h1>{title}</h1></div>
            {subtitleComponent}
            <div className={styles.metadata}>
                {createdTimeComponent}
                {categoryComponent}
            </div>
        </MDXContext.Provider>
    }
}

export default MDXHeader
