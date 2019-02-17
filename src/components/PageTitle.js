import React from 'react'
import styles from './PageTitle.module.scss'

class PageTitle extends React.Component {
    render() {
        const {
            textStyle='sans',
            title,
            subtitle,
        } = this.props;

        const subtitleComponent = subtitle
            ? <div className={styles.subtitle}>
                <h2 className={styles[textStyle]}>{subtitle}</h2>
            </div>
            : null;

        return <React.Fragment>
            <div className={styles.title}>
                <h1 className={styles[textStyle]}>{title}</h1>
            </div>
            {subtitleComponent}
        </React.Fragment>
    }
}

export default PageTitle
