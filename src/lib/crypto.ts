function toUTF8Array(str: string): number[] {
  const utf8: number[] = [];
  for (let i = 0; i < str.length; i++) {
    let charcode = str.charCodeAt(i);
    if (charcode < 0x80) {
      utf8.push(charcode);
    } else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(
        0xe0 | (charcode >> 12),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f),
      );
    } else {
      i++;
      charcode =
        0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      utf8.push(
        0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f),
      );
    }
  }
  return utf8;
}

function pad(str: string, length: number): string {
  return str.padStart(length, '0');
}

export function encryptProtectedLink(input: string): string {
  const lead = Math.floor(Math.random() * 255);
  const codeUnits = toUTF8Array(input);
  const encryptedCodeUnits = codeUnits
    .map(code => (code + lead > 255 ? code + lead - 255 : code + lead))
    .map(code => pad(code.toString(16), 3));
  const leadStr = pad(lead.toString(16), 3);
  return [leadStr, ...encryptedCodeUnits].join('');
}
