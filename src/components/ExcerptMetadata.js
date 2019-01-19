import React from 'react'
import assert from 'assert'
const _ = require("lodash");

import TaxonomyList from '../components/TaxonomyList'

class ExcerptMetadata extends React.Component {
    render() {
        const { post } = this.props;

        const birthTime = <time>{post.fields.birthTime}</time>;

        const rawCategory = post.fields.category;
        const categorySlug = _.kebabCase(rawCategory);
        const rawTags = post.fields.tags;

        const categoryObjects = rawCategory !== "" ? {name: `${rawCategory}`, slug: `${categorySlug}`} : null;
        const tagsObjects = rawTags.map(tag => { return {name: tag, slug: `tags/${_.kebabCase(tag)}`} });

        const category = rawCategory !== "" ? (<TaxonomyList name="Category" taxonomies={[categoryObjects]}/>) : null;

        const tags = rawTags.length > 0 ? (<TaxonomyList name="Tags" taxonomies={tagsObjects}/>) : null;

        const lines = [[birthTime, category], [tags]];

        lines.filter((line) => {
            assert(Array.isArray(line));
            const filteredLine = line.filter(component => component !== null );
            return filteredLine.length === 0
        });

        return <div>
            {lines.map((components) => <div>
                {components.map((component) => <div>{component}</div>)}
            </div>)}
        </div>
    }
}

export default ExcerptMetadata
