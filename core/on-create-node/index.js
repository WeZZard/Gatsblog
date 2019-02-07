module.exports = function (arg) {
    [
        require('./on-create-mdx-documents'),
    ].forEach(_ => _(arg));
};
