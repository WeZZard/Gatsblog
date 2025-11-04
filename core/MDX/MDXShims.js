// Removed assert import to avoid webpack bundling issues
const debug = require('debug');
const locales = require('i18n-locales');

const getDocumentType = sourceInstanceName => {
  if (typeof sourceInstanceName !== 'string') {
    throw new Error('sourceInstanceName must be a string');
  }

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

const getTitle = (frontMatterTitle, documentName) => {
  if (!(frontMatterTitle === null || frontMatterTitle === undefined || typeof frontMatterTitle === 'string')) {
    throw new Error('frontMatterTitle must be null, undefined, or string');
  }
  if (!(documentName === null || documentName === undefined || typeof documentName === 'string')) {
    throw new Error('documentName must be null, undefined, or string');
  }

  const titles = [frontMatterTitle, documentName].filter(_ => _);
  return titles.reverse().pop() || '';
};

const getCreatedTime = (frontMatterDate, documentNameDate, birthTime) => {
  if (!(frontMatterDate === null || frontMatterDate === undefined || frontMatterDate instanceof Date)) {
    throw new Error('frontMatterDate must be null, undefined, or Date');
  }
  if (!(documentNameDate === null || documentNameDate === undefined || documentNameDate instanceof Date)) {
    throw new Error('documentNameDate must be null, undefined, or Date');
  }
  if (!(birthTime === null || birthTime === undefined || birthTime instanceof Date)) {
    throw new Error('birthTime must be null, undefined, or Date');
  }

  const createdTimes = [frontMatterDate, documentNameDate, birthTime].filter(
    _ => _,
  );
  return createdTimes.reverse().pop();
};

const makeDisambiguateIdentifier = (string, seed) => {
  let comp = seed === undefined ? 0x85ba : seed;

  for (let i = 0; i < string.length; i++) {
    comp ^= string.charCodeAt(i);
    comp +=
      (comp << 1) + (comp << 4) + (comp << 7) + (comp << 8) + (comp << 24);
  }

  return ('000' + comp.toString(16)).substr(-4);
};

let _isLocaleIdentifierPatternInitialized = false;
let _localeIdentifierPattern_;

const localeIdentifierPattern = () => {
  if (!_isLocaleIdentifierPatternInitialized) {
    _localeIdentifierPattern_ = locales.join('|');
  }
  if (typeof _localeIdentifierPattern_ !== 'string') {
    throw new Error('localeIdentifierPattern must be a string');
  }
  if (_localeIdentifierPattern_ === '') {
    throw new Error('localeIdentifierPattern cannot be empty');
  }
  return _localeIdentifierPattern_;
};

module.exports = {
  getDocumentType,
  getTitle,
  getCreatedTime,
  makeDisambiguateIdentifier,
  localeIdentifierPattern,
};
