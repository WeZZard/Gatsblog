const createPageOfHome = require('./createPageOfHome');
const createPagesForCategories = require('./createPagesForCategories');
/*
const createPageOfPost = require('./createPageOfPost');
const createPageOfPages = require('./createPageOfPages');
const createPageOfTag = require('./createPageOfTag');
const createPageOfTagIndex = require('./createPageOfTagIndex');
*/

const _functions = [
    createPageOfHome,
    // createPageOfPost,
    // createPageOfPages,
    createPagesForCategories,
    // createPageOfTag,
    // createPageOfTagIndex,
];

module.exports = (arg) => {
    _functions.forEach(_ => _(arg));
};
