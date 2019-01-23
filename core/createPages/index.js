const createPageOfHome = require('./createPageOfHome');
const createPageOfPost = require('./createPageOfPost');
const createPageOfPages = require('./createPageOfPages');
const createPageOfCategory = require('./createPageOfCategory');
const createPageOfTag = require('./createPageOfTag');
const createPageOfTagIndex = require('./createPageOfTagIndex');

const _functions = [
    createPageOfHome,
    // createPageOfPost,
    // createPageOfPages,
    // createPageOfCategory,
    // createPageOfTag,
    // createPageOfTagIndex,
];

module.exports = (arg) => {
    _functions.forEach(_ => _(arg));
};
