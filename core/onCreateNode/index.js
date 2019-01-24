const onCreateMDXDocuments = require('./onCreateMDXDocuments');
const onCreateConfigYaml = require('./onCreateConfigYaml');

module.exports = function (arg) {
    [
        onCreateMDXDocuments,
        onCreateConfigYaml,
    ].forEach(_ => _(arg));
};
