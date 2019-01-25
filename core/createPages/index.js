module.exports = (arg) => {
    [
        require('./createPageOfHome'),
        require('./createPageOfTags'),
        require('./createPagesForEachCategory'),
        require('./createPagesForEachPost'),
        require('./createPagesForEachPage'),
        require('./createPagesForEachTag'),
    ].forEach(_ => _(arg));
};
