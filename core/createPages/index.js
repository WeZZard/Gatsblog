const createPageOfHome = require('./createPageOfHome');
const createPageOfTags = require('./createPageOfTags');
const createPagesForCategories = require('./createPagesForCategories');
const createPagesForPosts = require('./createPagesForPosts');
const createPagesForPages = require('./createPagesForPages');
const createPagesForTags = require('./createPagesForTags');

const _functions = [
    createPageOfHome,
    // createPageOfTags,
    // createPagesForPosts,
    // createPagesForPages,
    createPagesForCategories,
    createPagesForTags,
];

module.exports = (arg) => {
    _functions.forEach(_ => _(arg));
};
