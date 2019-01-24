import React from 'react'
import styles from './Taxonomy.module.scss'

import TaxonomyItem from './TaxonomyItem'

class Taxonomy extends React.Component {
    render() {
        const { name, className, taxonomies } = this.props;

        const taxonomyItems = taxonomies.map((taxonomy) =>
            <li key={`${taxonomy.slug}`} className={styles.taxonomyItem}><TaxonomyItem taxonomy={taxonomy}/></li>
        );

        return <div className={[styles.taxonomy, className].join(" ")}>
            <div className={styles.taxonomyName}>
                <span>{name}</span>
            </div>
            <ul className={styles.taxonomyItemList}>
                {taxonomyItems}
            </ul>
        </div>
    }
}

export default Taxonomy
