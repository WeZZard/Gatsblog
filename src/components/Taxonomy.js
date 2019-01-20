import React from 'react'
import styles from './Taxonomy.module.scss'

import TaxonomyItem from './TaxonomyItem'

class Taxonomy extends React.Component {
    render() {
        const { name, taxonomies } = this.props;
        const taxonomyItems = taxonomies.map((taxonomy) => <li className={styles.taxonomyItem}><TaxonomyItem taxonomy={taxonomy}/></li>);

        return <div className={styles.taxonomy}>
            <span className={styles.taxonomyName}>{name}</span>
            <ul className={styles.taxonomyItemList}>
                {taxonomyItems}
            </ul>
        </div>
    }
}

export default Taxonomy
