import React from 'react'
import styles from './Taxonomy.module.scss'

import Link from './Link';

export default ({ kind, name, className, taxonomies }) => {
    const taxonomyItems = taxonomies.map((taxonomy) =>
        <li key={`${taxonomy.slug}`} className={styles.taxonomyItem}>
            <span className={styles.taxonomyItemContent}>
                <Link to={taxonomy.slug} kind={kind}>{taxonomy.name}</Link>
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
