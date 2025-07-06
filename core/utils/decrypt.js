const fromUTF8Array = require('./from-utf8-array');
const getSubstringChunks = require('./get-substring-chunks');

module.exports = string => {
  // Safety check for invalid input
  if (!string || typeof string !== 'string') {
    return '';
  }
  
  try {
    const data = getSubstringChunks(string, 3);
    const numbers = data.map(each => parseInt('0x' + each));
    const lead = numbers[0];
    const encrypted = numbers.slice(1);
    const codeUnits = encrypted.map(each =>
      each - lead < 0 ? each - lead + 255 : each - lead,
    );
    return fromUTF8Array(codeUnits);
  } catch (error) {
    // If decryption fails, return empty string
    console.warn('Decryption failed:', error);
    return '';
  }
};
