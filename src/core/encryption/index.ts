// UTF-8 string to byte array conversion
function toUTF8Array(str: string): number[] {
  const utf8: number[] = [];
  for (let i = 0; i < str.length; i++) {
    let charCode = str.charCodeAt(i);
    if (charCode < 0x80) {
      utf8.push(charCode);
    } else if (charCode < 0x800) {
      utf8.push(0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f));
    } else if (charCode < 0xd800 || charCode >= 0xe000) {
      utf8.push(
        0xe0 | (charCode >> 12),
        0x80 | ((charCode >> 6) & 0x3f),
        0x80 | (charCode & 0x3f),
      );
    }
    // surrogate pair
    else {
      i++;
      // 20 bits of 0x0-0xFFFFF into two halves
      charCode =
        0x10000 + (((charCode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      utf8.push(
        0xf0 | (charCode >> 18),
        0x80 | ((charCode >> 12) & 0x3f),
        0x80 | ((charCode >> 6) & 0x3f),
        0x80 | (charCode & 0x3f),
      );
    }
  }
  return utf8;
}

// Pad number string with leading zeros
function pad(num: string, size: number): string {
  let s = num;
  while (s.length < size) s = '0' + s;
  return s;
}

// Simple encryption for protecting social links
export function encrypt(string: string): string {
  const min = 0;
  const max = 255;
  const lead = Math.floor(Math.random() * (+max - +min) + +min);
  const codeUnits = toUTF8Array(string);
  const encryptedCodeUnits = codeUnits
    .map(code => parseInt(code.toString()))
    .map(code => (code + lead > 255 ? code + lead - 255 : code + lead))
    .map(code => pad(code.toString(16), 3));
  const leadStr = pad(lead.toString(16), 3);
  const data = [leadStr, ...encryptedCodeUnits];
  return data.join('');
}