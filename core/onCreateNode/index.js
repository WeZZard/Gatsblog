module.exports = function (arg) {
    [
        require('./onCreateMDXDocuments'),
    ].forEach(_ => _(arg));
};
