import React from 'react'
const _ = require("lodash");

import Taxonomy from './Taxonomy'
import styles from "./CategoryLabel.module.scss";

class CategoryLabel extends React.Component {
    render() {
        const { category } = this.props;
        const slug = _.kebabCase(category);

        const categoryObjects = category !== "" ? {name: `${category}`, slug: `${slug}`} : null;

        return <Taxonomy name="Category" className={styles.category} taxonomies={[categoryObjects]}/>
    }
}

export default CategoryLabel
