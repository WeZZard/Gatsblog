const remark = require('remark');
const assert = require('assert');
const debug = require('debug');
const locales = require('i18n-locales');

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

const makeDisambiguateIdentifier = (string, seed) => {
    const comp1 = (seed === undefined) ? 0x1c9 : seed;
    const comp2 = (seed === undefined) ? 0x852 : seed;
    const comp3 = (seed === undefined) ? 0x3ba : seed;
    const comp4 = (seed === undefined) ? 0xe0d : seed;

    const comps = [comp1, comp2, comp3, comp4];

    const compLength = string.length >> 2;

    for (let offset = 0; offset < 4; offset ++) {
        for (let i = 0; i < compLength; i++) {
            comps[offset] ^= string.charCodeAt(offset * compLength + i);
            comps[offset] += (comps[offset] << 1) + (comps[offset] << 4) + (comps[offset] << 7) + (comps[offset] << 8) + (comps[offset] << 24);
        }
    }

    const substr1 = ("00" + (comps[0] >>> 0).toString(16)).substr(-3);
    const substr2 = ("00" + (comps[1] >>> 0).toString(16)).substr(-3);
    const substr3 = ("00" + (comps[2] >>> 0).toString(16)).substr(-3);
    const substr4 = ("00" + (comps[3] >>> 0).toString(16)).substr(-3);

    return substr1 + substr2 + substr3 + substr4
};

let _isLocaleIdentifierPatternInitialized = false;
let _localeIdentifierPattern_;

const localeIdentifierPattern = () => {
    if (!_isLocaleIdentifierPatternInitialized) {
        _localeIdentifierPattern_ = locales.join('|');
    }
    assert(typeof _localeIdentifierPattern_  === 'string');
    assert(_localeIdentifierPattern_  !== '');
    return _localeIdentifierPattern_;
};

module.exports = {
    getDocumentType,
    _getTitleWithRawMarkdown,
    _getSubtitleWithRawMarkdown,
    getTitle,
    getSubtitle,
    getCreatedTime,
    makeDisambiguateIdentifier,
    localeIdentifierPattern,
};
