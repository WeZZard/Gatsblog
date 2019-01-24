import React from 'react'
const _ = require("lodash");

import Taxonomy from './Taxonomy'
import styles from "./CategoryLabel.module.scss";

class CategoryLabel extends React.Component {
    render() {
        const { category } = this.props;

        return <Taxonomy name="Category" className={styles.category} taxonomies={[category]}/>
    }
}

export default CategoryLabel
