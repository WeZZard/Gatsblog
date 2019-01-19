import React from 'react'
import { Link } from 'gatsby'

class TaxonomyLabel extends React.Component {
    render() {
        const { taxonomy } = this.props;
        const { name, slug } = taxonomy;

        return <div><span><Link to={slug}>{name}</Link></span></div>
    }
}

export default TaxonomyLabel