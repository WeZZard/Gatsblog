const onCreateMDXDocuments = require('./onCreateMDXDocuments');

module.exports = function (arg) {
    [
        onCreateMDXDocuments,
    ].forEach(_ => _(arg));
};
