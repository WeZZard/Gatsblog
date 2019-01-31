module.exports.filterTagsForPostNode = (postNode, tags) => {
    let tagTable = {};
    tags.forEach(tag => {
        tagTable[`${tag.name}`] = tag;
    });

    return postNode.node.tags.map(tag => tagTable[`${tag}`])
};

module.exports.filterCategoryForPostNode = (postNode, categories) => {
    let categoryTable = {};
    categories.forEach(category => {
        categoryTable[`${category.name}`] = category;
    });

    return categoryTable[`${postNode.node.category}`]
};
