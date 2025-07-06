import assert from 'assert';
import { localeIdentifierPattern, makeDisambiguateIdentifier } from './mdx-shims';

interface PostMetadata {
  name: string;
  relativePath: string;
  isIndex: boolean;
  lang?: string;
  isLocalized: boolean;
  createdTime?: Date;
  slug: string;
}

interface PageMetadata {
  name: string;
  relativePath: string;
  isIndex: boolean;
  lang?: string;
  isLocalized: boolean;
  slug: string;
}

const parseMetadataForRelativePathOfPost = (relativePath: string): PostMetadata => {
  const datePattern = `([0-9]{4})-([0-9]{2})-([0-9]{2})`;
  const timePattern = `T([0-9]{2})_([0-9]{2})_([0-9]{2})`;
  const timezoneOffsetPattern1 = `([0-9]{2})_([0-9]{2})`;
  const timezoneOffsetPattern3 = `([0-9]{2})([0-9]{2})`;
  const timezonePattern = `Z|((\\+|-)((${timezoneOffsetPattern1})|(${timezoneOffsetPattern3})))`;
  const indexDocumentPattern = `(index).mdx?`;

  const standalonePostNamePattern = `(.+).mdx?`;
  const wrappedPostNamePattern = `(.+)/${indexDocumentPattern}`;
  const localizedWrappedPostNamePattern = `(.+)/(${localeIdentifierPattern()})/${indexDocumentPattern}`;
  const pattern = new RegExp(
    `^` +
    `(${datePattern})` /* Year-Month-Day (required) */ +
    `((${timePattern})(${timezonePattern})?)?` /* Hour::Minute::Second and Time Zone Offset (optional) */ +
      `((-${localizedWrappedPostNamePattern})|(-${wrappedPostNamePattern})|(-${standalonePostNamePattern}))` +
      `$`,
  );

  const match = pattern.exec(relativePath);

  let metadata: PostMetadata = {
    name: '',
    relativePath: '',
    isIndex: false,
    isLocalized: false,
    slug: ''
  };

  if (match) {
    metadata.name = match[22] || match[26] || match[29];
    metadata.isIndex = match[24] === `index` || match[27] === `index`;
    if (match[23]) {
      metadata.lang = match[23];
      metadata.isLocalized = true;
    } else {
      metadata.isLocalized = false;
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
      createdTime += `T${hour}:${minute}:${second}`;
    }

    if (timezoneOffset && timezoneHourOffset && timezoneMinuteOffset) {
      createdTime += `${timezoneOffset}${timezoneHourOffset}:${timezoneMinuteOffset}`;
    }

    if (
      timezoneOffset &&
      concatenatedTimezoneHourOffset &&
      concatenatedTimezoneMinuteOffset
    ) {
      createdTime += `${timezoneOffset}${concatenatedTimezoneHourOffset}${concatenatedTimezoneMinuteOffset}`;
    }

    if (zuluTime === `Z`) {
      createdTime += `Z`;
    }

    metadata.createdTime = new Date(createdTime);

    const documentIdentifier = createdTime + '-' + metadata.name;

    const disambiguateIdentifier = makeDisambiguateIdentifier(documentIdentifier);

    const resourceName = `${year}/${month}/${
      metadata.name
    }-${disambiguateIdentifier}`;

    metadata.slug = `/post/${resourceName}`.toLocaleLowerCase();

    metadata.relativePath = relativePath.split('/').pop() || '';
  }

  return metadata;
};

const parseMetadataForRelativePathOfPage = (relativePath: string): PageMetadata => {
  const documentNamePattern = `(.+).mdx?`;
  const rootPathPattern = documentNamePattern;
  const nonRootIndexPathPattern = `(((.+)/)+)(index).mdx?`;
  const nonRootNonIndexPathPattern = `(((.+)/)+(((!index).+))).mdx?`;
  const localizedPathPattern = `(((.+)/)+((${localeIdentifierPattern()})/)(${documentNamePattern})`;
  const namePattern = `^(${localizedPathPattern})|(${nonRootNonIndexPathPattern})|(${nonRootIndexPathPattern})|(${rootPathPattern}))$`;

  const pattern = new RegExp(`${namePattern}`);

  let metadata: PageMetadata = {
    name: '',
    relativePath: '',
    isIndex: false,
    isLocalized: false,
    slug: ''
  };

  const match = pattern.exec(relativePath);

  if (match) {
    metadata.name = match[4] || match[19] || match[22];
    metadata.isIndex = match[20] === `index` || match[8] === `index`;
    if (match[6]) {
      metadata.lang = match[6];
      metadata.isLocalized = true;
    } else {
      metadata.isLocalized = false;
    }
    const documentIdentifier = metadata.name.toLocaleLowerCase();
    metadata.slug = `/${documentIdentifier}`;
    metadata.relativePath = relativePath.split('/').pop() || '';
  }

  return metadata;
};

export default function mdxRelativePathMetadata(sourceInstanceName: string, relativePath: string): PostMetadata | PageMetadata {
  assert(typeof sourceInstanceName === 'string');
  assert(typeof relativePath === 'string');

  switch (sourceInstanceName) {
    case 'Post':
      return parseMetadataForRelativePathOfPost(relativePath);
    case 'Page':
      return parseMetadataForRelativePathOfPage(relativePath);
    default:
      assert.fail(`Unexpected source instance name: ${sourceInstanceName}`);
  }
}