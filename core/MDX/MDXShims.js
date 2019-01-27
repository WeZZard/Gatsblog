const remark = require('remark');
const assert = require('assert');
const debug = require('debug');

const getDocumentType = (sourceInstanceName) => {
    assert(typeof sourceInstanceName === 'string');

    switch (sourceInstanceName) {
        case 'Post':    return 'Post';
        case 'Page':    return 'Page';
        default:
            debug(`Unexpected source instance name: ${sourceInstanceName}`);
            return undefined;
    }
};

const _getTitleWithRawMarkdown = (rawBody) => {
    assert(rawBody === undefined || rawBody === null || typeof rawBody === 'string');

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
    assert(rawBody === undefined || rawBody === null || typeof rawBody === 'string');

    const astNode = remark.parse(rawBody);
    if (astNode.children && astNode.children.length > 1) {
        const firstChildren = astNode.children[0];
        const secondChildren = astNode.children[1];
        if (firstChildren.type === 'heading' &&
            firstChildren.depth === 1 &&
            secondChildren.type === 'heading' &&
            secondChildren.depth === 1)
        {
            return secondChildren.children[0].value;
        }
    }
    return null;
};

const getTitle = (frontMatterTitle, rawBody, documentName) => {
    assert(frontMatterTitle === null || frontMatterTitle === undefined || typeof frontMatterTitle === 'string');
    assert(rawBody === null || rawBody === undefined || typeof rawBody === 'string');
    assert(documentName === null || documentName === undefined || typeof documentName === 'string');

    const firstHeading = _getTitleWithRawMarkdown(rawBody);
    const titles = [frontMatterTitle, firstHeading, documentName].filter(_ => _);
    return titles.reverse().pop() || "";
};

const getSubtitle = (frontMatterSubtitle, rawBody) => {
    assert(frontMatterSubtitle === null || frontMatterSubtitle === undefined || typeof frontMatterSubtitle === 'string');
    assert(rawBody === null || rawBody === undefined || typeof rawBody === 'string');

    const firstHeading = _getSubtitleWithRawMarkdown(rawBody);
    const subtitles = [frontMatterSubtitle, firstHeading].filter(_ => _);
    return subtitles.reverse().pop() || "";
};

const getCreatedTime = (frontMatterDate, documentNameDate, birthTime) => {
    assert(frontMatterDate === null || frontMatterDate === undefined || frontMatterDate instanceof Date);
    assert(documentNameDate === null || documentNameDate === undefined || documentNameDate instanceof Date);
    assert(birthTime === null || birthTime === undefined || birthTime instanceof Date);

    const createdTimes = [frontMatterDate, documentNameDate, birthTime].filter(_ => _);
    return createdTimes.reverse().pop();
};

module.exports = {
    getDocumentType,
    _getTitleWithRawMarkdown,
    _getSubtitleWithRawMarkdown,
    getTitle,
    getSubtitle,
    getCreatedTime,
};
