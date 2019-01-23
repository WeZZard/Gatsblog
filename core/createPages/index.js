const createPageOfCategory = require('./createPageOfCategory');
const createPageOfHome = require('./createPageOfHome');
const createPageOfPages = require('./createPageOfPages');
const createPageOfPost = require('./createPageOfPost');
const createPageOfTag = require('./createPageOfTag');
const createPageOfTagIndex = require('./createPageOfTagIndex');

const _functions = [
    createPageOfCategory,
    createPageOfHome,
    createPageOfPages,
    createPageOfPost,
    createPageOfTag,
    createPageOfTagIndex,
];

module.exports = (arg) => {
    // _functions.forEach(fn => fn(arg));
};
