import React from 'react'
import styles from './ListLayout.module.scss'

class ListLayout extends React.Component {
    render() {
        const { children } = this.props;

        return <section className={styles.list}>
            {children}
        </section>;
    }
}

export default ListLayout
