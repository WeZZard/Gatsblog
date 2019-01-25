const createPageOfHome = require('./createPageOfHome');
const createPageOfTags = require('./createPageOfTags');
const createPagesForCategories = require('./createPagesForEachCategory');
const createPagesForPosts = require('./createPagesForEachPost');
const createPagesForPages = require('./createPagesForEachPage');
const createPagesForTags = require('./createPagesForEachTag');

const _functions = [
    createPageOfHome,
    createPageOfTags,
    createPagesForPosts,
    createPagesForPages,
    createPagesForCategories,
    createPagesForTags,
];

module.exports = (arg) => {
    _functions.forEach(_ => _(arg));
};
