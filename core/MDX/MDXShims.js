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

const _getTitleWithRawMarkdown = (rawBody) => {
    const astNode = remark.parse(rawBody);
    if (astNode.children && astNode.children.length > 0) {
        const firstChildren = astNode.children[0];
        if (firstChildren.type === 'heading' && firstChildren.depth === 1) {
            return firstChildren.children[0].value;
        }
    }
    return null;
};

const _getSubtitleWithRawMarkdown = (rawBody) => {
    const astNode = remark.parse(rawBody);
    if (astNode.children && astNode.children.length > 1) {
        const secondChildren = astNode.children[1];
        if (secondChildren.type === 'heading' && secondChildren.depth === 1) {
            return secondChildren.children[0].value;
        }
    }
    return null;
};

const _getTitle = (frontMatterTitle, rawBody, documentName) => {
    const firstHeading = _getTitleWithRawMarkdown(rawBody);
    const titles = [frontMatterTitle, firstHeading, documentName].filter(_ => _);
    return titles.reverse().pop() || "";
};

const _getSubtitle = (frontMatterSubtitle, rawBody) => {
    const firstHeading = _getSubtitleWithRawMarkdown(rawBody);
    const subtitles = [frontMatterSubtitle, firstHeading].filter(_ => _);
    return subtitles.reverse().pop() || "";
};

const _getCreatedTime = (frontMatterDate, documentNameDate, birthTime) => {
    const createdTimes = [frontMatterDate, documentNameDate, birthTime].filter(_ => _);
    return createdTimes.reverse().pop();
};

module.exports = {
    getDocumentType: _getDocumentType,
    _getTitleWithRawMarkdown: _getTitleWithRawMarkdown,
    getTitle: _getTitle,
    getSubtitle: _getSubtitle,
    getCreatedTime: _getCreatedTime,
};
