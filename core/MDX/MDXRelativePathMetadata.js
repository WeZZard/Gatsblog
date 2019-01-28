const assert = require('assert');
const locales = require('i18n-locales');
const {
    localeIdentifierPattern,
    makeDisambiguateIdentifier : _
} = require('./MDXShims');

const _parseMetadataForRelativePathOfPost = relativePath => {
    /*
  {
      name: string,
      documentIdentifier,
      isIndex: bool,
      lang: string?
      isLocalized: bool
      createdTime: Date?
      slug: string
  }
  */
    const datePattern = `([0-9]{4})-([0-9]{2})-([0-9]{2})`;
    const timePattern = `T([0-9]{2})_([0-9]{2})_([0-9]{2})`;
    const timezoneOffsetPattern1 = `([0-9]{2})_([0-9]{2})`;
    const timezoneOffsetPattern3 = `([0-9]{2})([0-9]{2})`;
    const timezonePattern = `Z|((\\+|-)((${timezoneOffsetPattern1})|(${timezoneOffsetPattern3})))`;
    const indexDocumentPattern = `(index).mdx?`;

    const standalonePostNamePattern = `(.+).mdx?`;
    const wrappedPostNamePattern = `(.+)/${indexDocumentPattern}`;
    const localizedPostNamePattern = `(.+)/(${localeIdentifierPattern()})/${indexDocumentPattern}`;
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
            metadata.lang = match[23];
            metadata.isLocalized = true
        } else {
            metadata.isLocalized = false
        }

        const year = match[2];
        const month = match[3];
        const day = match[4];
        const hour = match[7];
        const minute = match[8];
        const second = match[9];
        const zuluTime = match[10];
        const timezoneOffset = match[12];
        const timezoneHourOffset = match[15];
        const timezoneMinuteOffset = match[16];

        const concatenatedTimezoneHourOffset = match[18];
        const concatenatedTimezoneMinuteOffset = match[19];

        let createdTime = `${year}-${month}-${day}`;

        if (hour && minute && second) {
            createdTime += `T${hour}:${minute}:${second}`
        }

        if (timezoneOffset && timezoneHourOffset && timezoneMinuteOffset) {
            createdTime += `${timezoneOffset}${timezoneHourOffset}:${timezoneMinuteOffset}`
        }

        if (timezoneOffset && concatenatedTimezoneHourOffset && concatenatedTimezoneMinuteOffset) {
            createdTime += `${timezoneOffset}${concatenatedTimezoneHourOffset}${concatenatedTimezoneMinuteOffset}`
        }

        if (zuluTime === `Z`) {
            createdTime += `Z`
        }

        metadata.createdTime = new Date(createdTime);

        metadata.documentIdentifier = createdTime + "-" + metadata.name;

        const disambiguateIdentifier = _(metadata.documentIdentifier);

        const resourceName = `${year}/${month}/${metadata.name}-${disambiguateIdentifier}`;

        metadata.slug = `post/${resourceName}`.toLocaleLowerCase();
    }

    return metadata;
};

const _parseMetadataForRelativePathOfPage = relativePath => {
    /*
  {
      name: string,
      documentIdentifier,
      isIndex: bool,
      lang: string?
      isLocalized: bool
      slug: string
  }
  */
    const documentNamePattern = `(.+).mdx?`;
    const rootPathPattern = documentNamePattern;
    const nonRootIndexPathPattern = `(((.+)\/)+)(index).mdx?`;
    const nonRootNonIndexPathPattern = `(((.+)\/)+(((!index).+))).mdx?`;
    const localizedPathPattern = `(((.+)\/)+((${localeIdentifierPattern()})\/)(${documentNamePattern})`;
    const namePattern = `^(${localizedPathPattern})|(${nonRootNonIndexPathPattern})|(${nonRootIndexPathPattern})|(${rootPathPattern}))$`;

    const pattern = new RegExp(`${namePattern}`);

    let metadata = {};

    const match = pattern.exec(relativePath);

    if (match) {
        metadata.name = match[4] || match[19] || match[22];
        metadata.isIndex = match[20] === `index` || match[8] === `index`;
        if (match[6]) {
            metadata.lang = match[6];
            metadata.isLocalized = true
        } else {
            metadata.isLocalized = false
        }
        metadata.documentIdentifier = metadata.name.toLocaleLowerCase();
        metadata.slug = metadata.documentIdentifier;
    }
    return metadata;
};

module.exports = function(sourceInstanceName, relativePath) {
    assert(typeof sourceInstanceName === 'string');
    assert(typeof relativePath === 'string');

    switch (sourceInstanceName) {
        case 'Post':
            return _parseMetadataForRelativePathOfPost(relativePath);
        case 'Page':
            return _parseMetadataForRelativePathOfPage(relativePath);
        default:
            assert.fail(`Unexpected source instance name: ${sourceInstanceName}`);
    }
};
