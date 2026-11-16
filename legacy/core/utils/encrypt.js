const toUTF8Array = require('./to-utf8-array');
const pad = require('./pad');

module.exports = string => {
  const min = 0;
  const max = 255;
  const lead = Math.floor(Math.random() * (+max - +min) + +min);
  const codeUnits = toUTF8Array(string);
  const encryptedCodeUnits = codeUnits
    .map(code => parseInt(code))
    .map(code => (code + lead > 255 ? code + lead - 255 : code + lead))
    .map(code => pad(code.toString(16), 3));
  const leadStr = pad(lead.toString(16), 3);
  const data = [leadStr, ...encryptedCodeUnits];
  return data.join('');
};
