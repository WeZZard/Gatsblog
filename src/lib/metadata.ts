import locales from 'i18n-locales';

const localePatternString = (locales as string[]).join('|');

export function makeDisambiguateIdentifier(
  str: string,
  seed: number = 0x85ba,
): string {
  let comp = seed;
  for (let i = 0; i < str.length; i++) {
    comp ^= str.charCodeAt(i);
    comp +=
      (comp << 1) + (comp << 4) + (comp << 7) + (comp << 8) + (comp << 24);
  }
  return ('000' + comp.toString(16)).slice(-4);
}

export interface ParsedPostPath {
  name: string;
  relativePath: string;
  isIndex: boolean;
  lang?: string;
  isLocalized: boolean;
  createdTime?: Date;
  slug: string;
}

export function parsePostRelativePath(relativePath: string): ParsedPostPath {
  const datePattern = `([0-9]{4})-([0-9]{2})-([0-9]{2})`;
  const timePattern = `T([0-9]{2})_([0-9]{2})_([0-9]{2})`;
  const timezoneOffsetPattern1 = `([0-9]{2})_([0-9]{2})`;
  const timezoneOffsetPattern3 = `([0-9]{2})([0-9]{2})`;
  const timezonePattern = `Z|((\\+|-)((${timezoneOffsetPattern1})|(${timezoneOffsetPattern3})))`;
  const indexDocumentPattern = `(index).mdx?`;

  const standalonePostNamePattern = `(.+).mdx?`;
  const wrappedPostNamePattern = `(.+)/${indexDocumentPattern}`;
  const localizedWrappedPostNamePattern = `(.+)/(${localePatternString})/${indexDocumentPattern}`;
  const pattern = new RegExp(
    `^` +
      `(${datePattern})` +
      `((${timePattern})(${timezonePattern})?)?` +
      `((-${localizedWrappedPostNamePattern})|(-${wrappedPostNamePattern})|(-${standalonePostNamePattern}))` +
      `$`,
  );

  const match = pattern.exec(relativePath);
  if (!match) {
    const baseName = relativePath.replace(/\.mdx?$/, '').split('/').pop() || 'post';
    return {
      name: baseName,
      relativePath: relativePath.split('/').pop() || relativePath,
      isIndex: false,
      isLocalized: false,
      slug: `/post/${baseName.toLowerCase()}`,
    };
  }

  const name = match[22] || match[26] || match[29];
  const isIndex = match[24] === 'index' || match[27] === 'index';
  const lang = match[23] || undefined;
  const isLocalized = Boolean(lang);

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

  let createdTimeStr = `${year}-${month}-${day}`;
  if (hour && minute && second) {
    createdTimeStr += `T${hour}:${minute}:${second}`;
  }
  if (timezoneOffset && timezoneHourOffset && timezoneMinuteOffset) {
    createdTimeStr += `${timezoneOffset}${timezoneHourOffset}:${timezoneMinuteOffset}`;
  }
  if (
    timezoneOffset &&
    concatenatedTimezoneHourOffset &&
    concatenatedTimezoneMinuteOffset
  ) {
    createdTimeStr += `${timezoneOffset}${concatenatedTimezoneHourOffset}${concatenatedTimezoneMinuteOffset}`;
  }
  if (zuluTime === 'Z') {
    createdTimeStr += 'Z';
  }

  const createdTime = new Date(createdTimeStr);
  const documentIdentifier = `${createdTimeStr}-${name}`;
  const disambiguateIdentifier = makeDisambiguateIdentifier(documentIdentifier);
  const resourceName = `${year}/${month}/${name}-${disambiguateIdentifier}`;

  return {
    name,
    relativePath: relativePath.split('/').pop() || relativePath,
    isIndex,
    lang,
    isLocalized,
    createdTime,
    slug: `/post/${resourceName}`.toLowerCase(),
  };
}

export interface ParsedPagePath {
  name: string;
  relativePath: string;
  isIndex: boolean;
  lang?: string;
  isLocalized: boolean;
  slug: string;
}

export function parsePageRelativePath(relativePath: string): ParsedPagePath {
  const parts = relativePath.split('/');
  const fileName = parts[parts.length - 1] || '';
  const isIndex = /^index\.mdx?$/i.test(fileName);
  const localeSet = new Set(locales as string[]);

  let lang: string | undefined;
  let isLocalized = false;
  let name: string;

  if (parts.length >= 2 && localeSet.has(parts[parts.length - 2])) {
    lang = parts[parts.length - 2];
    isLocalized = true;
    name = isIndex
      ? parts[parts.length - 3] || 'index'
      : fileName.replace(/\.mdx?$/i, '');
  } else if (isIndex && parts.length >= 2) {
    name = parts[parts.length - 2];
  } else {
    name = fileName.replace(/\.mdx?$/i, '');
  }

  return {
    name,
    relativePath: fileName,
    isIndex,
    lang,
    isLocalized,
    slug: `/${name.toLowerCase()}`,
  };
}
