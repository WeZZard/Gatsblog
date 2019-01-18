const { _parseMetadataForMarkdownNode } = require('./_parsers')
const assert = require('assert');

const _decorateMarkdownRemarkDocuments = (node, getNode, actions) => {
    const { createNodeField } = actions

    if (node.internal.type == 'MarkdownRemark') {
        console.log(`Decorating markdown document at: ${getNode(node.parent).relativePath}.`)
        
        let metadata = _parseMetadataForMarkdownNode(node, getNode)

        assert(metadata.documentType !== undefined)
        assert(metadata.slug !== undefined)
        assert(metadata.birthTime !== undefined)
        assert(metadata.tags !== undefined)
        assert(metadata.category !== undefined)
        assert(metadata.title !== undefined)

        createNodeField({node, name: 'documentType', value: metadata.documentType})
        createNodeField({node, name: 'slug', value: metadata.slug})
        createNodeField({node, name: 'birthTime', value: metadata.birthTime})
        createNodeField({node, name: 'tags',  value: metadata.tags})
        createNodeField({node, name: 'category',  value: metadata.category})
        createNodeField({node, name: 'title',  value: metadata.title})
    }
}

module.exports = function (node, getNode, actions) {
    _decorateMarkdownRemarkDocuments(node, getNode, actions)
}
