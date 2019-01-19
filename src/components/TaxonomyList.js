import React from 'react'
import TaxonomyLabel from '../components/TaxonomyLabel'

class TaxonomyList extends React.Component {
    render() {
        const { name, taxonomies } = this.props;
        const taxonomyLabels = taxonomies.map((taxonomy) => <li><TaxonomyLabel taxonomy={taxonomy}/></li>);

        return <div>
            <span>{name}</span>
            <ul>
                {taxonomyLabels}
            </ul>
        </div>
    }
}

export default TaxonomyList
