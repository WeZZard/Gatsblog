const debug = require('debug');
const assert = require('assert')
const locales = require('i18n-locales');

let _isLocaleIdentifierPatternInitialized = false;
let _localeIdentifierPattern_;

const _localeIdentifierPattern = () => {
    if (!_isLocaleIdentifierPatternInitialized) {
        _localeIdentifierPattern_ = locales.join('|');
    }
    assert(typeof _localeIdentifierPattern_  === 'string');
    assert(_localeIdentifierPattern_  !== '');
    return _localeIdentifierPattern_;
};

const _parseMetadataForRelativePathOfPost = relativePath => {
    /*
  {
      name: string,
      documentIdentifier,
      isIndex: bool,
      localeIdentifier: string?
      createdTime: Date?
      slug: string
  }
  */
    const datePattern = `([0-9]{4})\-([0-9]{2})-([0-9]{2})`;
    const timePattern = `T([0-9]{2})_([0-9]{2})_([0-9]{2})`;
    const timezoneOffsetPattern1 = `([0-9]{2})_([0-9]{2})`;
    const timezoneOffsetPattern3 = `([0-9]{2})([0-9]{2})`;
    const timezonePattern = `Z|((\\+|-)((${timezoneOffsetPattern1})|(${timezoneOffsetPattern3})))`;
    const indexDocumentPattern = `(index).mdx?`;

    const standalonePostNamePattern = `(.+).mdx?`;
    const wrappedPostNamePattern = `(.+)/${indexDocumentPattern}`;
    const localizedPostNamePattern = `(.+)/(${_localeIdentifierPattern()})/${indexDocumentPattern}`;
    const pattern = new RegExp(
        `^`
        + `(${datePattern})` /* Year-Month-Day (required) */
        + `((${timePattern})(${timezonePattern})?)?` /* Hour::Minute::Second and Time Zone Offset (optional) */
        + `((-${localizedPostNamePattern})|(-${wrappedPostNamePattern})|(-${standalonePostNamePattern}))`
        + `$`
    );

    const match = pattern.exec(relativePath);

    let metadata = {};

    if (match) {
        metadata.name = match[22] || match[26] || match[29];
        metadata.isIndex = match[24] === `index` || match[27] === `index`;
        if (match[23]) {
            metadata.localeIdentifier = match[23];
        }

        const year = match[2];
        const month = match[3];
        const day = match[4];
        const hour = match[7];
        const minute = match[8];
        const second = match[9];
        const timezoneOffset = match[12] || match[10];
        const timezoneHourOffset = match[15] || match[18];
        const timezoneMinuteOffset = match[16] || match[19];

        const createdDate = `${year}-${month}-${day}`;

        let createdTime = createdDate;

        if (hour && minute && second) {
            createdTime += `T${hour}:${minute}:${second}`
        }

        if (timezoneOffset && timezoneHourOffset && timezoneMinuteOffset) {
            createdTime += `${timezoneOffset}${timezoneHourOffset}:${timezoneMinuteOffset}`
        } else if (timezoneOffset === `Z`) {
            createdTime += `Z`
        }

        metadata.createdTime = new Date(createdTime);
        metadata.documentIdentifier = createdDate + "-" + (match[22] || match[26] || match[29]);
        metadata.slug = metadata.localeIdentifier
            ? `${metadata.localeIdentifier}/${metadata.documentIdentifier}`
            : metadata.documentIdentifier
    }

    return metadata;
};

const _parseMetadataForRelativePathOfPage = relativePath => {
    /*
  {
      name: string,
      documentIdentifier,
      isIndex: bool,
      localeIdentifier: string?
      slug: string
  }
  */
    const documentNamePattern = `(.+).mdx?`;
    const rootPathPattern = documentNamePattern;
    const nonRootIndexPathPattern = `(((.+)\/)+)(index).mdx?`;
    const nonRootNonIndexPathPattern = `(((.+)\/)+(((!index).+))).mdx?`;
    const localizedPathPattern = `(((.+)\/)+((${_localeIdentifierPattern()})\/)(${documentNamePattern})`;
    const namePattern = `^(${localizedPathPattern})|(${nonRootNonIndexPathPattern})|(${nonRootIndexPathPattern})|(${rootPathPattern}))$`;

    const pattern = new RegExp(`${namePattern}`);

    let metadata = {};

    const match = pattern.exec(relativePath);

    if (match) {
        metadata.name = match[4] || match[19] || match[22];
        metadata.isIndex = match[20] === `index` || match[8] === `index`;
        if (match[6]) {
            metadata.localeIdentifier = match[6];
        }
        metadata.documentIdentifier = match[4] || match[19] || match[22];
        metadata.slug = metadata.localeIdentifier
            ? `${metadata.localeIdentifier}/${metadata.documentIdentifier}`
            : metadata.documentIdentifier
    }
    return metadata;
};

module.exports = function(sourceInstanceName, relativePath) {
    switch (sourceInstanceName) {
        case 'Post':
            return _parseMetadataForRelativePathOfPost(relativePath);
        case 'Page':
            return _parseMetadataForRelativePathOfPage(relativePath);
        default:
            debug(`Unexpected source instance name: ${sourceInstanceName}`);
            return undefined;
    }
};
