import React from 'react'
import { Link } from 'gatsby'
import styles from './Taxonomy.module.scss'

class TaxonomyItem extends React.Component {
    render() {
        const { taxonomy } = this.props;
        const { name, slug } = taxonomy;

        return <span><Link to={slug}>{name}</Link></span>
    }
}

export default TaxonomyItem
