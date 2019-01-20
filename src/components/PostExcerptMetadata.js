import React from 'react'
import assert from 'assert'
const _ = require("lodash");

import TaxonomyList from '../components/TaxonomyList'

class PostExcerptMetadata extends React.Component {
    render() {
        const { post } = this.props;

        const birthTime = new Date(post.node.fields.birthTime);
        const isoBirthTime = birthTime.toISOString();
        const localizedBirthTime = birthTime.toLocaleDateString("enUS", { year: 'numeric', month: 'short', day: 'numeric' });
        const birthTimeComponent = <time datetime={isoBirthTime}>{localizedBirthTime}</time>;

        const rawCategory = post.node.fields.category;
        const categorySlug = _.kebabCase(rawCategory);
        const rawTags = post.node.fields.tags;

        const categoryObjects = rawCategory !== "" ? {name: `${rawCategory}`, slug: `${categorySlug}`} : null;
        const tagsObjects = rawTags.map(tag => { return {name: tag, slug: `tags/${_.kebabCase(tag)}`} });

        const category = rawCategory !== "" ? (<TaxonomyList name="Category" taxonomies={[categoryObjects]}/>) : null;

        const tags = rawTags.length > 0 ? (<TaxonomyList name="Tags" taxonomies={tagsObjects}/>) : null;

        const lines = [[birthTimeComponent, category], [tags]];

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

export default PostExcerptMetadata
