const onCreateMDXDocuments = require('./onCreateMDXDocuments');

const _functions = [
    onCreateMDXDocuments,
];

module.exports = function (arg) {
    _functions.forEach(_ => _(arg));
};
