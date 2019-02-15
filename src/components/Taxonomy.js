import React from 'react'
import styles from './Taxonomy.module.scss'

import { Link } from 'gatsby';

class Taxonomy extends React.Component {
    render() {
        const { name, className, taxonomies } = this.props;

        const taxonomyItems = taxonomies.map((taxonomy) =>
            <li key={`${taxonomy.slug}`} className={styles.taxonomyItem}>
                <span className={styles.taxonomyItemContent}>
                    <Link to={taxonomy.slug}>{taxonomy.name}</Link>
                </span>
            </li>
        );

        return <div className={[styles.taxonomy, className].join(" ")}>
            <div className={styles.taxonomyName}>
                <label className={styles.taxonomyNameContent}>
                    {name}
                </label>
            </div>
            <ul className={styles.taxonomyItemList}>
                {taxonomyItems}
            </ul>
        </div>
    }
}

export default Taxonomy
