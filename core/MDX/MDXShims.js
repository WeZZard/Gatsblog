var remark = require('remark');
const debug = require('debug');

const _getDocumentType = (sourceInstanceName) => {
    switch (sourceInstanceName) {
        case 'Post':    return 'Post';
        case 'Page':    return 'Page';
        default:
            debug(`Unexpected source instance name: ${sourceInstanceName}`);
            return undefined;
    }
};

const _getFirstHeading = (rawBody) => {
    const astNode = remark.parse(rawBody);
    if (astNode.children && astNode.children.length > 0) {
        const firstChildren = astNode.children[0];
        if (firstChildren.type === 'heading' && firstChildren.depth === 1) {
            return firstChildren.children[0].value;
        }
    }
    return null;
};

const _getTitle = (frontMatterTitle, rawBody, documentName) => {
    const firstHeading = _getFirstHeading(rawBody);
    const titles = [frontMatterTitle, firstHeading, documentName].filter(_ => _);
    return titles.reverse().pop();
};

const _getCreatedTime = (frontMatterDate, documentNameDate, birthTime) => {
    const createdTimes = [frontMatterDate, documentNameDate, birthTime].filter(_ => _);
    return createdTimes.reverse().pop();
};

module.exports = {
    getDocumentType: _getDocumentType,
    _getFirstHeading: _getFirstHeading,
    getTitle: _getTitle,
    getCreatedTime: _getCreatedTime,
};
