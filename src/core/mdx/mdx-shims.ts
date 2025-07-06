import assert from 'assert';
import debug from 'debug';
// @ts-ignore - i18n-locales doesn't have TypeScript definitions
import locales from 'i18n-locales';

export const getDocumentType = (sourceInstanceName: string): string | undefined => {
  assert(typeof sourceInstanceName === 'string');

  switch (sourceInstanceName) {
    case 'Post':
      return 'Post';
    case 'Page':
      return 'Page';
    default:
      debug(`Unexpected source instance name: ${sourceInstanceName}`);
      return undefined;
  }
};

export const getTitle = (frontMatterTitle?: string | null, documentName?: string | null): string => {
  assert(
    frontMatterTitle === null ||
      frontMatterTitle === undefined ||
      typeof frontMatterTitle === 'string',
  );
  assert(
    documentName === null ||
      documentName === undefined ||
      typeof documentName === 'string',
  );

  const titles = [frontMatterTitle, documentName].filter(_ => _);
  return titles.reverse().pop() || '';
};

export const getCreatedTime = (frontMatterDate?: Date | null, documentNameDate?: Date | null, birthTime?: Date | null): Date | undefined => {
  assert(
    frontMatterDate === null ||
      frontMatterDate === undefined ||
      frontMatterDate instanceof Date,
  );
  assert(
    documentNameDate === null ||
      documentNameDate === undefined ||
      documentNameDate instanceof Date,
  );
  assert(
    birthTime === null || birthTime === undefined || birthTime instanceof Date,
  );

  const createdTimes = [frontMatterDate, documentNameDate, birthTime].filter(
    (date): date is Date => date instanceof Date,
  );
  return createdTimes.reverse().pop();
};

export const makeDisambiguateIdentifier = (string: string, seed?: number): string => {
  let comp = seed === undefined ? 0x85ba : seed;

  for (let i = 0; i < string.length; i++) {
    comp ^= string.charCodeAt(i);
    comp +=
      (comp << 1) + (comp << 4) + (comp << 7) + (comp << 8) + (comp << 24);
  }

  return ('000' + comp.toString(16)).substr(-4);
};

let _isLocaleIdentifierPatternInitialized = false;
let _localeIdentifierPattern_: string;

export const localeIdentifierPattern = (): string => {
  if (!_isLocaleIdentifierPatternInitialized) {
    _localeIdentifierPattern_ = locales.join('|');
    _isLocaleIdentifierPatternInitialized = true;
  }
  assert(typeof _localeIdentifierPattern_ === 'string');
  assert(_localeIdentifierPattern_ !== '');
  return _localeIdentifierPattern_;
};