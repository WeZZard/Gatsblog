const assert = require('assert');

// MARK: - Parse Metadata for Markdown Node

// Pattern for post in a document wrapper.
const _wrappedPostPathPattern = /([0-9]{4})-([0-9]{2})-([0-9]{2})(T([0-9]{2})_([0-9]{2})_([0-9]{2})(Z|([+\-])((([0-9]{2})_([0-9]{2}))|([0-9]{2})|(([0-9]{2})([0-9]{2})))))?-(.+)\/index\.md$/

// Pattern for post with a single markdown file.
const _standalonePostPathPattern = /([0-9]{4})-([0-9]{2})-([0-9]{2})(T([0-9]{2})_([0-9]{2})_([0-9]{2})(Z|([+\-])((([0-9]{2})_([0-9]{2}))|([0-9]{2})|(([0-9]{2})([0-9]{2})))))?-(.+)\.md$/

// Pattern for page in a document wrapper.
const _wrappedPagePathPattern = /(.+)\/index\.md$/

// Pattern for page with a single markdown file.
const _standalonePagePathPattern = /(.+)\.md$/

const _taxonomyPattern = /^[\w\-_]+$/

const _populatePostMetadataForNodeWithMatch = (node, match) => {
    const year = match[1]
    const month = match[2]
    const day = match[3]
    let hour = '00'
    let minute = '00'
    let second = '00'
    let tzOffset = '+'
    let tzHourOffset = '00'
    let tzMinuteOffset = '00'
    if (match[5] !== undefined) { hour = match[5] }
    if (match[6] !== undefined) { minute = match[6] }
    if (match[7] !== undefined) { second = match[7] }
    if (match[8] !== undefined && match[8] != 'Z') {
        tzOffset = match[9]
    }
    if (match[12] !== undefined) { tzHourOffset = match[12] }
    if (match[13] !== undefined) { tzMinuteOffset = match[13] }
    if (match[14] !== undefined) { tzHourOffset = match[14] }
    if (match[16] !== undefined) { tzHourOffset = match[16] }
    if (match[17] !== undefined) { tzMinuteOffset = match[17] }

    const postName = match[18]

    const nominalBirthTimeString = `${year}-${month}-${day}T${hour}:${minute}:${second}${tzOffset}${tzHourOffset}:${tzMinuteOffset}`

    const nominalBirthTime = new Date(nominalBirthTimeString)

    assert(nominalBirthTime != null)
    assert(nominalBirthTime != undefined)

    let birthTime = nominalBirthTime

    if (node.frontmatter.date !== undefined) {
        birthTime = new Date(node.frontmatter.date)
    }

    const slugYear = birthTime.getFullYear()
    const slugMonth = birthTime.getMonth()
    const slugDay = birthTime.getDate()

    assert(!slugYear.isNaN)
    assert(!slugMonth.isNaN)
    assert(!slugDay.isNaN)

    return {
        documentType: 'Post',
        slug: `${slugYear}/${slugMonth}/${slugDay}/${postName}`,
        birthTime: birthTime,
    }
}

const _parseTagsForMarkdownNode = (node) => {
    assert(node.internal.type == 'MarkdownRemark')

    if (node.frontmatter.tags !== undefined) {
        const rawTags = node.frontmatter.tags

        if (Array.isArray(rawTags)) {
            for (eachRawTag in rawTags) {
                assert(_taxonomyPattern.exec(eachRawTag) != null, `A tag("${eachRawTag}") may only contain word characters, dash lines (-) and underscores (_).`)
            }
            return rawTags
        } else {
            throw `The "tag" frontmatter for markdown document at ${node.absoluteFilePath} shall be an array of strings.`;
        }
    } else {
        return []
    }
}

const _parseCategoryForMarkdownNode = (node) => {
    assert(node.internal.type == 'MarkdownRemark')
    
    if (node.frontmatter.category !== undefined) {
        if (String.isString(rawTags)) {
            const rawCategory = node.frontmatter.category
            assert(_taxonomyPattern.exec(rawCategory) != null, `A category(${rawCategory}) may only contain word characters, dash lines (-) and underscores (_).`)
            return rawCategory
        } else {
            throw `The "category" frontmatter for markdown document at ${node.absoluteFilePath} shall be a string.`;
        }
    } else {
        return ""
    }
}

module.exports._parseMetadataForMarkdownNode = (node, getNode) => {
    assert(node.internal.type == 'MarkdownRemark')

    const parentNode = getNode(node.parent)

    let { relativePath } = parentNode

    const tags = _parseTagsForMarkdownNode(node)
    const category = _parseCategoryForMarkdownNode(node)

    const title = node.frontmatter.title
    
    if (parentNode.sourceInstanceName == "posts") {
        const wrappedPostMatch = _wrappedPostPathPattern.exec(relativePath)
        const standalonePostMatch = _standalonePostPathPattern.exec(relativePath)
        if (wrappedPostMatch !== null) {
            let metadata = _populatePostMetadataForNodeWithMatch(node, wrappedPostMatch)
            metadata.category = category
            metadata.tags = tags
            metadata.title = title || metadata.slug
            return metadata
        } else if (standalonePostMatch !== null) {
            let metadata = _populatePostMetadataForNodeWithMatch(node, standalonePostMatch)
            metadata.category = category
            metadata.tags = tags
            metadata.title = title || metadata.slug
            return metadata
        } else {
            throw `Invalid filename: ${parentNode.base}.`
        }
    } else if (parentNode.sourceInstanceName == "content") {
        const wrappedPageMatch = _wrappedPagePathPattern.exec(relativePath)
        const standalonePageMatch = _standalonePagePathPattern.exec(relativePath)

        let pageName

        if (wrappedPageMatch !== null) {
            pageName = wrappedPageMatch[1]
        } else if (standalonePageMatch !== null) {
            pageName = standalonePageMatch[1]
        } else {
            throw `Invalid filename: ${relativePath}.`
        }

        return {
            documentType: 'Page',
            slug: `${pageName}`,
            birthTime: parentNode.birthTime,
            title: title || pageName,
            category: category,
            tags: tags,
        }
    } else {
        let { name } = parentNode
        let { relativeDirectory } = parentNode
    
        return {
            documentType: 'Unknown',
            slug: `${relativeDirectory}/${name}`,
            birthTime: parentNode.birthTime,
            title: title || name,
            category: category,
            tags: tags,
        }
    }
}